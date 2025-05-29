namespace MagazineManagment.Dto.MagazineDto
{
    public abstract class MagazineBaseDto
    {
        public string Title { get; set; } = string.Empty;
        public string? IssueNumber { get; set; }
        public DateTime PublicationDate { get; set; }
        public string? CoverImageUrl { get; set; }
        public string? Description { get; set; }
        public string? Editor { get; set; }
        public string? ISSN { get; set; }
        public string? Category { get; set; }
        public bool IsPublished { get; set; }
        public string CreatedBy { get; set; } = string.Empty;
        public string CreatedByName { get; set;} = string.Empty;
    }

}
