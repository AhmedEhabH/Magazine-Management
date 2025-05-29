import { GetArticleDto, GetArticleSummaryDto, GetArticleWithMagazineDto } from "./article";

// MagazineBaseDto
export interface MagazineBaseDto {
  title: string;
  issueNumber?: string;
  publicationDate: Date;
  coverImageUrl?: string;
  description?: string;
  editor?: string;
  issn?: string;
  category?: string;
  isPublished: boolean;
  createdBy: string;
  createdByName: string;
}

// AddMagazineDto
export interface AddMagazineDto extends MagazineBaseDto {
  id: number;
}

// UpdateMagazineDto
export interface UpdateMagazineDto extends MagazineBaseDto {
  id: number;
}

// GetMagazineDto
export interface GetMagazineDto extends MagazineBaseDto {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  articles: GetArticleWithMagazineDto[];
}

// GetMagazinesDto
export interface GetMagazinesDto {
  magazines: GetMagazineDto[];
  totalCount: number;
}

// GetMagazineSummaryDto
export interface GetMagazineSummaryDto {
  id: number;
  title: string;
  issueNumber?: string;
  publicationDate: Date;
  coverImageUrl?: string;
}
