namespace MagazineManagment.Dto.AuthDto
{
    public class UpdateUserDto : IEmailDto
    {
        public string Email { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public bool EmailConfirmed { get; set; }
    }
}
