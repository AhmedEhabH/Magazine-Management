using Microsoft.AspNetCore.Identity;

namespace MagazineManagment.SeedData
{
    public static class SeedRole
    {
        public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        {
            string[] roleNames = { "Admin", "Writer", "Reviewer", "User" };
            foreach (var roleName in roleNames)
            {
                if (!await roleManager.RoleExistsAsync(roleName))
                {
                    await roleManager.CreateAsync(new IdentityRole(roleName));
                }
            }
        }

        public static async Task SeedUsersAsync(UserManager<IdentityUser> userManager)
        {
            // Admin user
            await CreateUserIfNotExists(userManager, "admin@magazine.com", "Admin123!", "Admin");

            // Writers (20 users)
            for (int i = 1; i <= 49; i++)
            {
                await CreateUserIfNotExists(userManager, $"writer{i}@magazine.com", "Writer123!", "Writer");
            }

            // Reviewers (15 users)
            for (int i = 1; i <= 15; i++)
            {
                await CreateUserIfNotExists(userManager, $"reviewer{i}@magazine.com", "Reviewer123!", "Reviewer");
            }

            // Regular users (14 users)
            for (int i = 1; i <= 14; i++)
            {
                await CreateUserIfNotExists(userManager, $"user{i}@magazine.com", "User123!", "User");
            }
        }

        private static async Task CreateUserIfNotExists(UserManager<IdentityUser> userManager, string email, string password, string role)
        {
            var user = await userManager.FindByEmailAsync(email);
            if (user == null)
            {
                user = new IdentityUser
                {
                    UserName = email,
                    Email = email,
                    EmailConfirmed = true
                };
                await userManager.CreateAsync(user, password);
                await userManager.AddToRoleAsync(user, role);
            }
        }

        // Helper methods for seeding
        //public static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
        //{
        //    string[] roleNames = { "Admin", "Writer", "Reviewer", "User" };

        //    foreach (var roleName in roleNames)
        //    {
        //        if (!await roleManager.RoleExistsAsync(roleName))
        //        {
        //            await roleManager.CreateAsync(new IdentityRole(roleName));
        //        }
        //    }
        //}

        //public static async Task SeedAdminUserAsync(UserManager<IdentityUser> userManager)
        //{
        //    var adminEmail = "admin@magazine.com";
        //    var adminUser = await userManager.FindByEmailAsync(adminEmail);

        //    if (adminUser == null)
        //    {
        //        adminUser = new IdentityUser
        //        {
        //            UserName = adminEmail,
        //            Email = adminEmail,
        //            EmailConfirmed = true
        //        };

        //        await userManager.CreateAsync(adminUser, "Admin123!");
        //        await userManager.AddToRoleAsync(adminUser, "Admin");
        //    }
        //}
    }
}
