using AutoMapper;
using MagazineManagment.Data;
using MagazineManagment.Dto.Admin;
using MagazineManagment.Dto.ArticleDto;
using MagazineManagment.Dto.AuthDto;
using MagazineManagment.Dto.MagazineDto;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MagazineManagment.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "Admin")]
    public class DashboardController : ControllerBase
    {
        private readonly ApplicationDbContext _context;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;

        public DashboardController(
            ApplicationDbContext context,
            UserManager<IdentityUser> userManager,
            RoleManager<IdentityRole> roleManager,
            IMapper mapper
            )
        {
            _context = context;
            _userManager = userManager;
            _roleManager = roleManager;
            _mapper = mapper;
        }

        // STATISTICS ENDPOINTS
        [HttpGet("statistics")]
        public async Task<IActionResult> GetStatistics()
        {
            var stats = new DashboardStatsDto
            {
                TotalUsers = await _userManager.Users.CountAsync(),
                TotalMagazines = await _context.Magazines.CountAsync(),
                TotalArticles = await _context.Articles.CountAsync(),
                PublishedMagazines = await _context.Magazines.CountAsync(m => m.IsPublished),
                PendingArticles = await _context.Articles.CountAsync(a => a.Status == "Pending"),
                ApprovedArticles = await _context.Articles.CountAsync(a => a.Status == "Approved"),
                RejectedArticles = await _context.Articles.CountAsync(a => a.Status == "Rejected"),
                UsersRegisteredThisMonth = await _userManager.Users
                    .CountAsync(u => u.LockoutEnd == null &&
                        EF.Functions.DateDiffMonth(DateTime.Now, DateTime.Now) == 0),
                RecentActivity = await GetRecentActivity()
            };


            return Ok(stats);
        }

        [HttpGet("statistics/charts")]
        public async Task<IActionResult> GetChartData()
        {
            var monthlyData = await GetMonthlyRegistrations();
            var roleDistribution = await GetRoleDistribution();
            var magazinesByCategory = await GetMagazinesByCategory();
            var articleStatusDistribution = await GetArticleStatusDistribution();

            return Ok(new
            {
                MonthlyRegistrations = monthlyData,
                RoleDistribution = roleDistribution,
                MagazinesByCategory = magazinesByCategory,
                ArticleStatusDistribution = articleStatusDistribution
            });
        }

        // USER MANAGEMENT ENDPOINTS
        [HttpGet("users")]
        public async Task<IActionResult> GetAllUsers([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var users = await _userManager.Users
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var userDtos = new List<UserDto>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                var userDto = _mapper.Map<UserDto>(user);
                userDto.Roles = roles;
                userDtos.Add(userDto);
            }

            var totalUsers = await _userManager.Users.CountAsync();
            return Ok(new
            {
                Users = userDtos,
                TotalCount = totalUsers,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalUsers / pageSize)
            });
        }

        [HttpGet("users/{id}")]
        public async Task<IActionResult> GetUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var roles = await _userManager.GetRolesAsync(user);
            var userArticles = await _context.Articles.Where(a => a.AuthorId == id).ToListAsync();
            var userMagazines = await _context.Magazines.Where(m => m.CreatedBy == id).ToListAsync();

            var userDto = _mapper.Map<UserDetailDto>(user);
            userDto.Roles = roles;
            userDto.Articles = _mapper.Map<List<GetArticleDto>>(userArticles);
            userDto.Magazines = _mapper.Map<List<GetMagazineDto>>(userMagazines);

            return Ok(userDto);
        }

        [HttpPut("users/{id}")]
        public async Task<IActionResult> UpdateUser(string id, [FromBody] UpdateUserDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            user.Email = dto.Email;
            user.UserName = dto.UserName;
            user.EmailConfirmed = dto.EmailConfirmed;

            var result = await _userManager.UpdateAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "User updated successfully" });
        }

        [HttpPost("users/{id}/assign-role")]
        public async Task<IActionResult> AssignRole(string id, [FromBody] AssignRoleDto dto)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.AddToRoleAsync(user, dto.RoleName);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = "Role assigned successfully" });
        }

        [HttpDelete("users/{id}")]
        public async Task<IActionResult> DeleteUser(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            // Delete user's articles and magazines
            var userArticles = await _context.Articles.Where(a => a.AuthorId == id).ToListAsync();
            var userMagazines = await _context.Magazines.Where(m => m.CreatedBy == id).ToListAsync();

            _context.Articles.RemoveRange(userArticles);
            _context.Magazines.RemoveRange(userMagazines);

            var result = await _userManager.DeleteAsync(user);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            await _context.SaveChangesAsync();
            return Ok(new { Message = "User deleted successfully" });
        }

        [HttpPost("users/{id}/toggle-lock")]
        public async Task<IActionResult> ToggleUserLock(string id)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            if (user.LockoutEnd.HasValue && user.LockoutEnd > DateTimeOffset.UtcNow)
            {
                // Unlock user
                await _userManager.SetLockoutEndDateAsync(user, null);
                return Ok(new { Message = "User unlocked successfully", IsLocked = false });
            }
            else
            {
                // Lock user for 100 years (permanent lock)
                await _userManager.SetLockoutEndDateAsync(user, DateTimeOffset.UtcNow.AddYears(100));
                return Ok(new { Message = "User locked successfully", IsLocked = true });
            }
        }

        // ROLE MANAGEMENT ENDPOINTS
        [HttpGet("roles")]
        public async Task<IActionResult> GetAllRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles);
        }

        [HttpDelete("users/{id}/roles/{roleName}")]
        public async Task<IActionResult> RemoveRole(string id, string roleName)
        {
            var user = await _userManager.FindByIdAsync(id);
            if (user == null)
                return NotFound();

            var result = await _userManager.RemoveFromRoleAsync(user, roleName);
            if (!result.Succeeded)
                return BadRequest(result.Errors);

            return Ok(new { Message = $"Role {roleName} removed successfully" });
        }

        // MAGAZINE MANAGEMENT ENDPOINTS
        [HttpGet("magazines")]
        public async Task<IActionResult> GetAllMagazines([FromQuery] int page = 1, [FromQuery] int pageSize = 10)
        {
            var magazines = await _context.Magazines
                .Include(m => m.Articles)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalMagazines = await _context.Magazines.CountAsync();

            return Ok(new
            {
                Magazines = magazines,
                TotalCount = totalMagazines,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalMagazines / pageSize)
            });
        }

        [HttpPut("magazines/{id}/toggle-publish")]
        public async Task<IActionResult> ToggleMagazinePublish(int id)
        {
            var magazine = await _context.Magazines.FindAsync(id);
            if (magazine == null)
                return NotFound();

            magazine.IsPublished = !magazine.IsPublished;
            magazine.UpdatedAt = DateTime.UtcNow;

            await _context.SaveChangesAsync();
            return Ok(new { Message = $"Magazine {(magazine.IsPublished ? "published" : "unpublished")} successfully" });
        }

        // ARTICLE MANAGEMENT ENDPOINTS
        [HttpGet("articles")]
        public async Task<IActionResult> GetAllArticles([FromQuery] int page = 1, [FromQuery] int pageSize = 10, [FromQuery] string? status = null)
        {
            var query = _context.Articles.Include(a => a.Magazine).AsQueryable();

            if (!string.IsNullOrEmpty(status))
                query = query.Where(a => a.Status == status);

            var articles = await query
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .ToListAsync();

            var totalArticles = await query.CountAsync();

            return Ok(new
            {
                Articles = articles,
                TotalCount = totalArticles,
                Page = page,
                PageSize = pageSize,
                TotalPages = (int)Math.Ceiling((double)totalArticles / pageSize)
            });
        }

        [HttpPut("articles/{id}/status")]
        public async Task<IActionResult> UpdateArticleStatus(int id, [FromBody] UpdateArticleStatusDto dto)
        {
            var article = await _context.Articles.FindAsync(id);
            if (article == null)
                return NotFound();

            article.Status = dto.Status;
            //article.ReviewComments = dto.Comments;
            article.ReviewedAt = DateTime.UtcNow;
            article.ReviewedBy = User?.Identity?.Name;

            await _context.SaveChangesAsync();
            return Ok(new { Message = "Article status updated successfully" });
        }

        // HELPER METHODS
        private async Task<List<object>> GetRecentActivity()
        {
            var recentArticles = await _context.Articles
                .OrderByDescending(a => a.CreatedAt)
                .Take(5)
                .Select(a => new { Type = "Article", Title = a.Title, Date = a.CreatedAt })
                .ToListAsync();

            var recentMagazines = await _context.Magazines
                .OrderByDescending(m => m.CreatedAt)
                .Take(5)
                .Select(m => new { Type = "Magazine", Title = m.Title, Date = m.CreatedAt })
                .ToListAsync();

            return recentArticles.Cast<object>()
                .Concat(recentMagazines.Cast<object>())
                .OrderByDescending(x => ((dynamic)x).Date)
                .Take(10)
                .ToList();
        }

        private async Task<List<object>> GetMonthlyRegistrations()
        {
            // Simplified - you might want to implement proper monthly grouping
            var users = await _userManager.Users.ToListAsync();
            return new List<object>
        {
            new { Month = "Jan", Count = users.Count / 12 },
            new { Month = "Feb", Count = users.Count / 12 },
            new { Month = "Mar", Count = users.Count / 12 },
            // Add more months...
        };
        }

        private async Task<List<object>> GetRoleDistribution()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            var distribution = new List<object>();

            foreach (var role in roles)
            {
                var usersInRole = await _userManager.GetUsersInRoleAsync(role.Name!);
                distribution.Add(new { Role = role.Name, Count = usersInRole.Count });
            }

            return distribution;
        }

        private async Task<List<object>> GetMagazinesByCategory()
        {
            return await _context.Magazines
                .GroupBy(m => m.Category ?? "Uncategorized")
                .Select(g => new { Category = g.Key, Count = g.Count() })
                .Cast<object>()
                .ToListAsync();
        }

        private async Task<List<object>> GetArticleStatusDistribution()
        {
            return await _context.Articles
                .GroupBy(a => a.Status)
                .Select(g => new { Status = g.Key, Count = g.Count() })
                .Cast<object>()
                .ToListAsync();
        }
    }
}
