namespace MagazineManagment.Dto.Admin
{
    public class DashboardStatsDto
    {
        public int TotalUsers { get; set; }
        public int TotalMagazines { get; set; }
        public int TotalArticles { get; set; }
        public int PublishedMagazines { get; set; }
        public int PendingArticles { get; set; }
        public int ApprovedArticles { get; set; }
        public int RejectedArticles { get; set; }
        public int UsersRegisteredThisMonth { get; set; }
        public List<object> RecentActivity { get; set; } = new();
    }
}
