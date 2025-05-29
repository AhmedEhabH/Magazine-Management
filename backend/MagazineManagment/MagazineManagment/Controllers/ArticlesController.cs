using AutoMapper;
using MagazineManagment.Data;
using MagazineManagment.Dto.ArticleDto;
using MagazineManagment.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MagazineManagment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ArticlesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;

        public ArticlesController(ApplicationDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Example: Get single article
        [HttpGet("{id}")]
        public async Task<ActionResult<GetArticleWithMagazineDto>> GetArticle(int id)
        {
            var article = await _context.Articles
                .Include(a => a.AuthorUser)
                .Include(a => a.Magazine)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (article == null) return NotFound();
            return Ok(_mapper.Map<GetArticleWithMagazineDto>(article));
        }

        // GET: api/Articles
        [HttpGet]
        public async Task<ActionResult<GetArticlesDto>> GetArticles()
        {
            var articles = await _context.Articles
                .OrderByDescending(a => a.CreatedAt)
                .Include(a => a.AuthorUser)
                .Include(a => a.Magazine)
                .ToListAsync();

            // If you want full details:
            //var articleDtos = _mapper.Map<List<GetArticleDto>>(articles);
            var summaries = _mapper.Map<List<GetArticleWithMagazineDto>>(articles);

            var result = new GetArticlesDto
            {
                Articles = summaries,
                TotalCount = summaries.Count
            };
            return Ok(result);

            // If you want only summaries:
            // var summaries = _mapper.Map<List<GetArticleSummaryDto>>(articles);
            // return Ok(summaries);
        }

        // GET: api/magazines/{magazineId}/articles
        
        [HttpGet("GetArticlesByMagazineId/{magazineId}")]
        public async Task<ActionResult<GetArticlesDto>> GetArticlesByMagazineId(int magazineId)
        {
            var articles = await _context.Articles
                .Where(a => a.MagazineId == magazineId)
                .OrderByDescending(a => a.CreatedAt)
                .Include(a => a.AuthorUser)
                .Include (a => a.Magazine)
                .ToListAsync();

            var articlesDto = _mapper.Map<List<GetArticleWithMagazineDto>>(articles);

            var result = new GetArticlesDto
            {
                Articles = articlesDto,
                TotalCount = articlesDto.Count
            };

            return Ok(result);
        }


        // Example: Get all article summaries
        [HttpGet("summary")]
        public async Task<ActionResult<List<GetArticleSummaryDto>>> GetArticleSummaries()
        {
            var articles = await _context.Articles.Include(a => a.Magazine).ToListAsync();
            var summaries = _mapper.Map<List<GetArticleSummaryDto>>(articles);
            return Ok(summaries);
        }

        // Example: Add article
        // Writer-only endpoint
        [Authorize(Roles = "Admin,Writer")]
        [HttpPost]
        public async Task<ActionResult<GetArticleDto>> AddArticle(AddArticleDto dto)
        {
            var entity = _mapper.Map<Article>(dto);
            entity.CreatedAt = DateTime.UtcNow;
            entity.UpdatedAt = DateTime.UtcNow;
            _context.Articles.Add(entity);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetArticle), new { id = entity.Id }, _mapper.Map<GetArticleWithMagazineDto>(entity));
        }

        // Reviewer-only endpoint
        [Authorize(Roles = "Reviewer")]
        [HttpPost("review")]
        public async Task<IActionResult> ReviewArticle(int id) {
            var article = await _context.Articles
                .Include(a => a.Magazine)
                .FirstOrDefaultAsync(a => a.Id == id);
            if (article == null) return NotFound();
            return Ok(_mapper.Map<GetArticleWithMagazineDto>(article));
        }


        // Example: Update article
        [Authorize(Roles = "Reviewer,Writer,Admin")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, UpdateArticleDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var entity = await _context.Articles.FindAsync(id);
            if (entity == null) return NotFound();
            _mapper.Map(dto, entity);
            entity.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Articles/5
        // Admin-only endpoint
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
                return NotFound();

            _context.Articles.Remove(article);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
