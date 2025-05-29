namespace MagazineManagment.Dto.Admin
{
    public class UpdateArticleStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? ReviewComments { get; set; }
    }
}
