using MagazineManagment.Data;
using MagazineManagment.Dto.ArticleDto;
using MagazineManagment.Dto.MagazineDto;
using MagazineManagment.Model;
using Microsoft.AspNetCore.Identity;
using System.Text.Json;

namespace MagazineManagment.SeedData
{
    public static class SeedData
    {
        public static async Task SeedMagazinesAndArticlesAsync(ApplicationDbContext context, IWebHostEnvironment env, UserManager<IdentityUser> userManager)
        {
            if (context.Magazines.Any() || context.Articles.Any())
                return; // Already seeded

            var fileName = "seedv2.json";
            var filePath = Path.Combine(env.ContentRootPath, "SeedData", fileName);

            if (!File.Exists(filePath)) return;

            var json = await File.ReadAllTextAsync(filePath);
            var options = new JsonSerializerOptions
            {
                PropertyNameCaseInsensitive = true
            };

            var seed = JsonSerializer.Deserialize<SeedRoot>(json, options);

            // Create a mapping of email to userId
            var userMap = new Dictionary<string, string>();
            var users = userManager.Users.ToList();
            foreach (var user in users)
            {
                if (user.Email != null)
                    userMap[user.Email] = user.Id;
            }

            // Seed magazines
            var magazines = seed?.Magazines?.Select(m => new Magazine
            {
                Title = m.Title,
                IssueNumber = m.IssueNumber,
                PublicationDate = m.PublicationDate,
                CoverImageUrl = m.CoverImageUrl,
                Description = m.Description,
                Editor = m.Editor,
                ISSN = m.ISSN,
                Category = m.Category,
                IsPublished = m.IsPublished,
                CreatedBy = userMap.ContainsKey(m.CreatedBy) ? userMap[m.CreatedBy] : userMap["admin@magazine.com"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }).ToList();

            if (magazines != null && magazines.Any())
            {
                context.Magazines.AddRange(magazines);
                await context.SaveChangesAsync();
            }

            // Seed articles
            var articles = seed?.Articles?.Select(a => new Article
            {
                MagazineId = a.MagazineId,
                Title = a.Title,
                Subtitle = a.Subtitle,
                //Author = a.Author,
                Content = a.Content,
                Summary = a.Summary,
                PageNumber = a.PageNumber,
                Source = a.Source,
                Status = a.Status,
                AuthorId = userMap.ContainsKey(a.AuthorId) ? userMap[a.AuthorId] : userMap["admin@magazine.com"],
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }).ToList();

            if (articles != null && articles.Any())
            {
                context.Articles.AddRange(articles);
                await context.SaveChangesAsync();
            }
        }
    }

    // Helper classes for deserialization
    public class SeedRoot
    {
        public List<AddMagazineDto>? Magazines { get; set; }
        public List<AddArticleDto>? Articles { get; set; }
    }
}
