namespace MagazineManagment.Dto.MagazineDto
{
    public class GetMagazineSummaryDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? IssueNumber { get; set; }
        public DateTime PublicationDate { get; set; }
        public string? CoverImageUrl { get; set; }

    }
}
