import { Component, OnInit } from '@angular/core';
import { GetArticleDto, GetArticlesDto, GetArticleWithMagazineDto } from '../../interfaces/article';
import { ArticleService } from '../../services/article.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

@Component({
	selector: 'app-home',
	imports: [
		CommonModule,
		MatCardModule,
		MatIconModule,
		MatButtonModule
	],
	templateUrl: './home.component.html',
	styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
	articles: GetArticleWithMagazineDto[] = [];
	loading: boolean = true;

	constructor(
		private articleService: ArticleService,
		private router: Router
	) { }
	ngOnInit(): void {
		this.getArticles();
	}

	getArticles(): void {
		this.loading = true;
		this.articleService.getArticles().subscribe({
			next: (data: any) => {
				// If your API returns { articles: [], ... }, adjust accordingly
				this.articles = (data.articles || data).sort(
					(a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
				this.loading = false;
			},
			error: (err) => {
				console.error(err);
				this.loading = false;
			}
		});
	}

	openArticleDetails(id: any) {
		this.router.navigate(['/articles', id]);
	}

	goToMagazine(magazineId: any, event: Event): void {
		event.stopPropagation();
		this.router.navigate(['/magazines', magazineId]);
	}

	trackByArticleId(index: number, article: GetArticleWithMagazineDto): any {
		return article.id;
	}

}
