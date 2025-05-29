// ArticleBaseDto
export interface ArticleBaseDto {
  title: string;
  subtitle?: string;
  authorId: string;
  authorName: string;
  content: string;
  summary?: string;
  pageNumber?: number;
  source?: string;
  status?: string;
  reviewComments?: string;
  reviewedAt?: Date;
  reviewedBy?: string;
}

// AddArticleDto
export interface AddArticleDto extends ArticleBaseDto {
  magazineId: number;
}

// UpdateArticleDto
export interface UpdateArticleDto extends ArticleBaseDto {
  id: number;
  magazineId: number;
}

// GetArticleDto
export interface GetArticleDto extends ArticleBaseDto {
  id: number;
  magazineId: number;
  createdAt: Date;
  updatedAt: Date;
}

// GetArticleWithMagazineDto
export interface GetArticleWithMagazineDto extends GetArticleDto {
  magazineName: string;
}

// GetArticleSummaryDto
export interface GetArticleSummaryDto {
  id: number;
  title: string;
  author?: string;
  magazineId: number;
  magazineName: string;
  status?: string;
  createdAt: Date;
}

// GetArticlesDto
export interface GetArticlesDto {
  articles: GetArticleWithMagazineDto[];
  totalCount: number;
}
