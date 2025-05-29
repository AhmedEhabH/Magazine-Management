namespace MagazineManagment.Dto.AuthDto
{
    public class LoginDto : IEmailDto, IPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
