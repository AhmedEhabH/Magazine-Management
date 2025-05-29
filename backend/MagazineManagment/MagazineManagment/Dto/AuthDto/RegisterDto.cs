namespace MagazineManagment.Dto.AuthDto
{
    public class RegisterDto : IEmailDto, IPasswordDto
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
