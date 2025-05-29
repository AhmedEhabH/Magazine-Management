// src/app/interfaces/dashboard-stats.dto.ts

export interface DashboardStatsDto {
  totalUsers: number;
  totalMagazines: number;
  totalArticles: number;
  publishedMagazines: number;
  pendingArticles: number;
  approvedArticles: number;
  rejectedArticles: number;
  usersRegisteredThisMonth: number;
  recentActivity: any[]; // Replace 'any' with a specific type if available
}
