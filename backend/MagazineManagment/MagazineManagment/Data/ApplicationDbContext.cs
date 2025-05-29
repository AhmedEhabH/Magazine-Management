using MagazineManagment.Model;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace MagazineManagment.Data
{
    public class ApplicationDbContext : IdentityDbContext<IdentityUser>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
        {
        }

        public DbSet<Magazine> Magazines { get; set; }
        public DbSet<Article> Articles { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // CRITICAL: Call base implementation first
            base.OnModelCreating(modelBuilder);

            // Configure Article-User relationship with RESTRICT
            modelBuilder.Entity<Article>()
                .HasOne(a => a.AuthorUser)
                .WithMany()
                .HasForeignKey(a => a.AuthorId)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Magazine-User relationship with RESTRICT
            modelBuilder.Entity<Magazine>()
                .HasOne(m => m.Creator)
                .WithMany()
                .HasForeignKey(m => m.CreatedBy)
                .OnDelete(DeleteBehavior.Restrict);

            // Configure Article-Magazine relationship with CASCADE
            modelBuilder.Entity<Article>()
                .HasOne(a => a.Magazine)
                .WithMany(m => m.Articles)
                .HasForeignKey(a => a.MagazineId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }


}
