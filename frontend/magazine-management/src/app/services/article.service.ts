import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GetArticleDto, GetArticlesDto, GetArticleWithMagazineDto } from '../interfaces/article';
import { environment } from '../../environments/environment';

@Injectable({
	providedIn: 'root'
})
export class ArticleService {
	
	

	private endPoint = 'Articles/'
	constructor(private http: HttpClient) { }
	addArticle(value: any): Observable<GetArticleWithMagazineDto> {
		return this.http.post<GetArticleWithMagazineDto>(`${environment.apiUrl}${this.endPoint}`, value);
	}

	getArticles(): Observable<GetArticlesDto> {
		return this.http.get<GetArticlesDto>(`${environment.apiUrl}${this.endPoint}`);
	}

	getArticleById(id: any): Observable<GetArticleWithMagazineDto> {
		return this.http.get<GetArticleWithMagazineDto>(`${environment.apiUrl}${this.endPoint}${id}`);
	}

	getArticlesByMagazineId(id: any): Observable<GetArticlesDto> {
		return this.http.get<GetArticlesDto>(`${environment.apiUrl}${this.endPoint}GetArticlesByMagazineId/${id}`);
	}

	updateArticle(result: any): Observable<GetArticleWithMagazineDto> {
		return this.http.put<GetArticleWithMagazineDto>(`${environment.apiUrl}${this.endPoint}${result.id}`, result);
	}

	deleteArticle(id: any) {
		return this.http.delete(`${environment.apiUrl}${this.endPoint}${id}`);
	}
}
