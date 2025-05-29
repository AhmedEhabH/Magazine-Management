using AutoMapper;
using AutoMapper.QueryableExtensions;
using MagazineManagment.Data;
using MagazineManagment.Dto.ArticleDto;
using MagazineManagment.Dto.MagazineDto;
using MagazineManagment.Model;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;

namespace MagazineManagment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MagazinesController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly IMapper _mapper;
        private readonly UserManager<IdentityUser> _userManager;
        public MagazinesController(ApplicationDbContext context, IMapper mapper, UserManager<IdentityUser> userManager)
        {
            _context = context;
            _mapper = mapper;
            _userManager = userManager;
        }

        // GET: api/Magazines
        [HttpGet]
        [ProducesResponseType(StatusCodes.Status200OK, Type = typeof(GetMagazinesDto))]
        public async Task<ActionResult<GetMagazinesDto>> GetMagazines()
        {
            var magazines = await _context.Magazines
                .Include(m => m.Creator)
                .Include(m => m.Articles)
                .ThenInclude(a => a.AuthorUser)
                .OrderByDescending(m => m.CreatedAt)
                .ProjectTo<GetMagazineDto>(_mapper.ConfigurationProvider)
                .ToListAsync();
            return Ok(new GetMagazinesDto
            {
                Magazines = magazines,
                TotalCount = magazines.Count
            });

        }

        // GET: api/Magazines/5
        [HttpGet("{id}")]
        public async Task<ActionResult<GetMagazineDto>> GetMagazine(int id)
        {
            var magazine = await _context.Magazines
                .Include(m => m.Creator)
                .Include(m => m.Articles) // Eagerly load related articles
                .ThenInclude(a => a.AuthorUser)
                .FirstOrDefaultAsync(m => m.Id == id);

            if (magazine == null) return NotFound();
            return Ok(_mapper.Map<GetMagazineDto>(magazine));
        }

        // POST: api/Magazines
        [Authorize(Roles = "Admin,Writer")]
        [HttpPost]
        public async Task<ActionResult<GetMagazineDto>> AddMagazine(AddMagazineDto dto)
        {
            var magazine = _mapper.Map<Magazine>(dto);
            magazine.CreatedAt = DateTime.UtcNow;
            magazine.UpdatedAt = DateTime.UtcNow;
            // Set the current user as creator
            var currentUserEmail = User.FindFirst(System.Security.Claims.ClaimTypes.Email)?.Value;
            if (!string.IsNullOrEmpty(currentUserEmail))
            {
                var user = await _userManager.FindByEmailAsync(currentUserEmail);
                if (user != null)
                {
                    magazine.CreatedBy = user.Id;
                }
            }
            _context.Magazines.Add(magazine);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetMagazine), new { id = magazine.Id }, _mapper.Map<GetMagazineDto>(magazine));
        }

        // PUT: api/Magazines/5
        [Authorize(Roles = "Admin,Writer")]
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateMagazine(int id, UpdateMagazineDto dto)
        {
            if (id != dto.Id) return BadRequest();
            var magazine = await _context.Magazines.FindAsync(id);
            if (magazine == null) return NotFound();

            _mapper.Map(dto, magazine);
            magazine.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: api/Magazines/5
        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteMagazine(int id)
        {
            var magazine = await _context.Magazines.FindAsync(id);
            if (magazine == null) return NotFound();

            _context.Magazines.Remove(magazine);
            await _context.SaveChangesAsync();
            // All associated articles are deleted automatically (cascade)
            return NoContent();
        }
    }
}
