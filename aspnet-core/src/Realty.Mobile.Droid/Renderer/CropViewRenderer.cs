using System.IO;
using Android.Content;
using Android.Graphics;
using Com.Theartofdev.Edmodo.Cropper;
using Realty.Controls;
using Realty.Renderer;
using Xamarin.Forms;
using Xamarin.Forms.Platform.Android;

/*https://github.com/ArthurHub/Android-Image-Cropper*/

[assembly: ExportRenderer(typeof(CropView), typeof(CropViewRenderer))]
namespace Realty.Renderer
{
    public class CropViewRenderer : PageRenderer
    {
        private static readonly Thickness ButtonMargin = new Thickness(5);

        public CropViewRenderer(Context context) : base(context)
        {

        }

        protected override void OnElementChanged(ElementChangedEventArgs<Page> e)
        {
            base.OnElementChanged(e);

            if (!(Element is CropView page))
            {
                return;
            }

            var cropImageView = CreateImageView(page);

            var imageGrid = new Grid
            {
                HorizontalOptions = LayoutOptions.FillAndExpand,
                VerticalOptions = LayoutOptions.FillAndExpand,
                Padding = 0,
                Children = { cropImageView }
            };

            var buttonLayout = new StackLayout
            {
                Orientation = StackOrientation.Horizontal,
                VerticalOptions = LayoutOptions.Start,
                HorizontalOptions = LayoutOptions.Center,
                Padding = new Thickness(0, 0, 0, 20),
                Children =
                {
                    CreateCancelButton(page, page.CancelText),
                    CreateRotateButton(cropImageView, page.RotateText),
                    CreateOkButton(page, cropImageView, page.OkText)
                }
            };

            page.Content = new StackLayout
            {
                VerticalOptions = LayoutOptions.FillAndExpand,
                Orientation = StackOrientation.Vertical,
                Spacing = 0,
                Padding = 0,
                Children = { imageGrid, buttonLayout }
            };
        }

        private CropImageView CreateImageView(CropView page)
        {
            var cropImageView = new CropImageView(Context)
            {
                LayoutParameters = new LayoutParams(LayoutParams.MatchParent, LayoutParams.MatchParent)
            };

            cropImageView.SetAspectRatio(1, 1);

            cropImageView.SetImageBitmap(BitmapFactory.DecodeByteArray(page.Image, 0, page.Image.Length));

            return cropImageView;
        }

        private static Button CreateRotateButton(CropImageView view, string buttonText)
        {
            var rotateButton = new Button
            {
                Text = buttonText,
                Style = Application.Current.Resources["WarnButton"] as Style,
                Margin = ButtonMargin
            };

            rotateButton.Clicked += (sender, ex) => view.RotateImage(90);
            return rotateButton;
        }


        private static Button CreateCancelButton(CropView page, string buttonText)
        {
            var rotateButton = new Button
            {
                Text = buttonText,
                Style = Application.Current.Resources["DangerButton"] as Style,
                Margin = ButtonMargin
            };

            rotateButton.Clicked += (sender, ex) =>
            {
                page.IsCropped = false;
                page.Navigation.PopModalAsync();
            };

            return rotateButton;
        }

        private static Button CreateOkButton(CropView page, CropImageView view, string buttonText)
        {
            var button = new Button
            {
                Text = buttonText,
                Style = Application.Current.Resources["ActionButton"] as Style,
                Margin = ButtonMargin
            };

            button.Clicked += (sender, ex) =>
            {
                var cropped = view.CroppedImage;
                using (var memory = new MemoryStream())
                {
                    cropped.Compress(Bitmap.CompressFormat.Jpeg, 100, memory);
                    page.CroppedImage = memory.ToArray();
                }

                page.IsCropped = true;
                page.Navigation.PopModalAsync();
            };

            return button;
        }
    }
}

