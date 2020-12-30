using System;
using System.Collections.Generic;
using System.IO;
using System.Threading.Tasks;
using System.Windows.Input;
using Abp.IO.Extensions;
using MvvmHelpers;
using Realty.Authorization.Users.Profile;
using Realty.Authorization.Users.Profile.Dto;
using Realty.Commands;
using Realty.Core.Threading;
using Realty.Models.NavigationMenu;
using Realty.Services.Navigation;
using Realty.ViewModels.Base;
using Plugin.Media;
using Plugin.Media.Abstractions;
using Xamarin.Forms;
using Xamarin.Forms.Internals;
using Acr.UserDialogs;
using FFImageLoading;
using Realty.ApiClient;
using Realty.Controls;
using Realty.Dto;
using Realty.Extensions;
using Realty.Localization;
using Realty.UI;
using Realty.UI.Assets;
using Realty.Views;
using DependencyResolver = Realty.Core.Dependency.DependencyResolver;

namespace Realty.ViewModels
{
    public class MainViewModel : XamarinViewModel
    {
        public ICommand PageAppearingCommand => HttpRequestCommand.Create(PageAppearing);
        public ICommand ChangeProfilePhotoCommand => new Command(ChangeProfilePhoto);
        public ICommand ShowProfilePhotoCommand => AsyncCommand.Create(ShowProfilePhoto);

        private readonly IProfileAppService _profileAppService;
        private readonly ProxyProfileControllerService _profileControllerService;
        private readonly IApplicationContext _applicationContext;

        private const string ApplicationName = "Realty";
        private ImageSource _photo;
        private bool _isInitialized;
        private byte[] _profilePictureBytes;
        private string _userNameAndSurname;
        private bool _showMasterPage;
        private string _applicationInfo;

        public MainViewModel(
            IProfileAppService profileAppService,
            ProxyProfileControllerService profileControllerService,
            IApplicationContext applicationContext)
        {
            _profileAppService = profileAppService;
            _profileControllerService = profileControllerService;
            _applicationContext = applicationContext;
            _isInitialized = false;
            WatchLanguageChanges();
        }

        private async Task PageAppearing()
        {
            if (_isInitialized)
            {
                return;
            }

            if (_applicationContext.LoginInfo == null)
            {
                return;
            }

            UserNameAndSurname = _applicationContext.LoginInfo.User.Name + " " + _applicationContext.LoginInfo.User.Surname;
            SetApplicationInfo();
            Photo = ImageSource.FromResource(AssetsHelper.ProfileImagePlaceholderNamespace);
            await GetUserPhoto(_applicationContext.LoginInfo.User.Id);
            BuildMenuItems();

            _isInitialized = true;
        }

        private void SetApplicationInfo()
        {
            ApplicationInfo = $"{ApplicationName}\n" +
                              $"v{_applicationContext.LoginInfo.Application.Version} " +
                              $"[{_applicationContext.LoginInfo.Application.ReleaseDate:yyyyMMdd}]";
        }

        public string UserNameAndSurname
        {
            get => _userNameAndSurname;
            set
            {
                _userNameAndSurname = value;
                RaisePropertyChanged(() => UserNameAndSurname);
            }
        }

        public string ApplicationInfo
        {
            get => _applicationInfo;
            set
            {
                _applicationInfo = value;
                RaisePropertyChanged(() => ApplicationInfo);
            }
        }

        public int MenuItemsCount
        {
            get
            {
                if (MenuItems == null)
                {
                    return -1;
                }

                return MenuItems.Count;
            }
        }

        public ImageSource Photo
        {
            get => _photo;
            set
            {
                _photo = value;
                RaisePropertyChanged(() => Photo);
            }
        }

        private async Task GetUserPhoto(long userId)
        {
            var result = await _profileAppService.GetProfilePictureByUser(userId);
            _profilePictureBytes = Convert.FromBase64String(result.ProfilePicture);
            Photo = ImageSource.FromStream(() => new MemoryStream(_profilePictureBytes));
        }

        private void ChangeProfilePhoto()
        {
            UserDialogs.Instance.ActionSheet(new ActionSheetConfig
            {
                Title = L.Localize("ChangeProfilePicture"),
                Options = new List<ActionSheetOption>  {
                    new ActionSheetOption(L.Localize("PickFromGallery"),  async () => await PickProfilePictureAsync(CropImageIfNeedsAsync)),
                    new ActionSheetOption(L.Localize("TakePhoto"),  async () => await TakeProfilePhotoAsync(CropImageIfNeedsAsync))
                }
            });
        }

        /// <summary>
        /// Shows a crop view to crop the media file.
        /// Native image cropping feature is available only on UWP and IOS.
        /// For Android devices, custom cropping is implemented.
        /// </summary>
        private async Task CropImageIfNeedsAsync(MediaFile photo)
        {
            if (photo == null)
            {
                return;
            }

            if (Device.RuntimePlatform == Device.Android)
            {
                var cropModalView = new CropView(photo.Path, OnCropCompleted, L.Localize("Ok"), L.Localize("Rotate"), L.Localize("Cancel"));
                await ModalService.ShowModalAsync(cropModalView);
            }
            else
            {
                await OnCropCompleted(File.ReadAllBytes(photo.Path), Path.GetFileName(photo.Path));
            }
        }

        private async Task OnCropCompleted(byte[] croppedImageBytes, string fileName)
        {
            if (croppedImageBytes == null)
            {
                return;
            }

            var jpgStream = await ResizeImageAsync(croppedImageBytes);
            await SaveProfilePhoto(jpgStream.GetAllBytes(), fileName);
        }

        private static async Task<Stream> ResizeImageAsync(byte[] imageBytes, int width = 256, int height = 256)
        {
            var result = ImageService.Instance.LoadStream(token =>
            {
                var tcs = new TaskCompletionSource<Stream>();
                tcs.TrySetResult(new MemoryStream(imageBytes));
                return tcs.Task;
            }).DownSample(width, height);

            return await result.AsJPGStreamAsync();
        }

        private static async Task PickProfilePictureAsync(Func<MediaFile, Task> picturePicked)
        {
            if (!CrossMedia.Current.IsPickPhotoSupported)
            {
                return;
            }

            using (var photo = await CrossMedia.Current.PickPhotoAsync())
            {
                await picturePicked(photo);
            }
        }

        private async Task TakeProfilePhotoAsync(Func<MediaFile, Task> photoTaken)
        {
            if (!CrossMedia.Current.IsCameraAvailable ||
                !CrossMedia.Current.IsTakePhotoSupported)
            {
                UserDialogHelper.Warn("NoCamera");
                return;
            }

            await SetBusyAsync(async () =>
            {
                using (var photo = await CrossMedia.Current.TakePhotoAsync(new StoreCameraMediaOptions
                {
                    DefaultCamera = CameraDevice.Front,
                    PhotoSize = PhotoSize.MaxWidthHeight,
                    AllowCropping = true,
                    CompressionQuality = 80,
                    MaxWidthHeight = 700
                }))
                {
                    await photoTaken(photo);
                }
            });
        }

        private async Task SaveProfilePhoto(byte[] photoAsBytes, string fileName)
        {
            await SetBusyAsync(async () =>
            {
                await WebRequestExecuter.Execute(async () => await UpdateProfilePhoto(photoAsBytes, fileName), () =>
                {
                    Photo = ImageSource.FromStream(() => new MemoryStream(photoAsBytes));
                    CloneProfilePicture(photoAsBytes);

                    return Task.CompletedTask;
                });
            });
        }

        private void CloneProfilePicture(byte[] photoAsBytes)
        {
            _profilePictureBytes = new byte[photoAsBytes.Length];
            photoAsBytes.CopyTo(_profilePictureBytes, 0);
        }

        private async Task UpdateProfilePhoto(byte[] photoAsBytes, string fileName)
        {
            var fileToken = Guid.NewGuid().ToString();

            using (Stream photoStream = new MemoryStream(photoAsBytes))
            {
                await _profileControllerService.UploadProfilePicture(content =>
                {
                    content.AddFile("file", photoStream, fileName);
                    content.AddString(nameof(FileDto.FileToken), fileToken);
                    content.AddString(nameof(FileDto.FileName), fileName);
                }).ContinueWith(uploadResult =>
                {
                    if (uploadResult == null)
                    {
                        return;
                    }

                    _profileAppService.UpdateProfilePicture(new UpdateProfilePictureInput
                    {
                        FileToken = fileToken
                    });
                });
            }
        }

        private async Task ShowProfilePhoto()
        {
            if (_profilePictureBytes == null)
            {
                return;
            }

            await ModalService.ShowModalAsync<ProfilePictureView>(_profilePictureBytes);
        }

        private void WatchLanguageChanges()
        {
            MessagingCenter.Instance.SubscribeSafe<MySettingsViewModel>(this, MessagingCenterKeys.LanguagesChanged, sender =>
            {
                BuildMenuItems();
            });
        }

        #region Navigation Menu
        public void BuildMenuItems()
        {
            var grantedMenutems = _applicationContext.Configuration.Auth.GrantedPermissions;
            MenuItems = DependencyResolver.Resolve<IMenuProvider>().GetAuthorizedMenuItems(grantedMenutems);
            RaisePropertyChanged(() => MenuItemsCount);
        }

        private ObservableRangeCollection<NavigationMenuItem> _menuItems;
        public ObservableRangeCollection<NavigationMenuItem> MenuItems
        {
            get => _menuItems;
            set
            {
                _menuItems = value;
                RaisePropertyChanged(() => MenuItems);
            }
        }


        private NavigationMenuItem _selectedMenuItem;
        public NavigationMenuItem SelectedMenuItem
        {
            get => _selectedMenuItem;
            set
            {
                _selectedMenuItem = value;
                ClearSelectedMenu();
                if (_selectedMenuItem != null)
                {
                    AsyncRunner.Run(NavigateToMenuAsync(_selectedMenuItem));
                }

                RaisePropertyChanged(() => SelectedMenuItem);
            }
        }

        public bool ShowMasterPage
        {
            get => _showMasterPage;
            set
            {
                _showMasterPage = value;
                RaisePropertyChanged(() => ShowMasterPage);
            }
        }

        private void ClearSelectedMenu()
        {
            MenuItems.ForEach(m => m.IsSelected = false);
        }

        private async Task NavigateToMenuAsync(NavigationMenuItem newNavigationMenu)
        {
            ShowMasterPage = false;
            SelectedMenuItem.IsSelected = true;
            await NavigationService.SetDetailPageAsync(newNavigationMenu.ViewType, _selectedMenuItem.NavigationParameter);
        }

        #endregion
    }
}
