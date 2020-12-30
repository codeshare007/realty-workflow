using Xamarin.Forms;

namespace Realty.Views
{
    public partial class LoginView : ContentPage, IXamarinView
    {
        public LoginView()
        {
            InitializeComponent();
            SetControlFocuses();
        }

        private void SetControlFocuses()
        {
            UsernameEntry.Completed += (s, e) =>
            {
                if (string.IsNullOrEmpty(PasswordEntry.Text))
                {
                    PasswordEntry.Focus();
                }
                else
                {
                    ExecuteLoginCommand();
                }
            };

            PasswordEntry.Completed += (s, e) =>
            {
                ExecuteLoginCommand();
            };
        }

        private void ExecuteLoginCommand()
        {
            if (LoginButton.IsEnabled)
            {
                LoginButton.Command.Execute(null);
            }
        }
    }
}