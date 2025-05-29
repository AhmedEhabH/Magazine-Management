import { Component, OnInit } from '@angular/core';
import { GetArticleDto, GetArticleWithMagazineDto } from '../../interfaces/article';
import { ArticleService } from '../../services/article.service';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-article-details',
	imports: [CommonModule, MatCardModule],
	templateUrl: './article-details.component.html',
	styleUrl: './article-details.component.scss'
})
export class ArticleDetailsComponent implements OnInit {
	article: GetArticleWithMagazineDto | null = null;
	isAuthenticated$!: Observable<boolean>;

	constructor(
		private route: ActivatedRoute,
		private articleService: ArticleService,
		private authService: AuthService // Inject AuthService
	) { 
		this.isAuthenticated$ = this.authService.isAuthenticated$;
	}
	ngOnInit(): void {
		
		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.articleService.getArticleById(id).subscribe({
				next: (data) => this.article = data,
				error: (err) => console.error(err)
			});
		}
	}
}
