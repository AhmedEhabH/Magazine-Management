namespace MagazineManagment.Dto.MagazineDto
{
    public class GetMagazinesDto
    {
        public List<GetMagazineDto> Magazines { get; set; } = new();
        public int TotalCount { get; set; }
    }
}
