import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatCard, MatCardContent, MatCardModule, MatCardTitle } from '@angular/material/card';
import { ActivatedRoute, Router } from '@angular/router';
import { MagazineService } from '../../services/magazine.service';
import { GetMagazineDto } from '../../interfaces/magazine';
import { GetArticleDto, GetArticlesDto, GetArticleWithMagazineDto } from '../../interfaces/article';
import { MatDialog } from '@angular/material/dialog';
import { ArticleFormComponent } from '../article-form/article-form.component';
import { ArticleService } from '../../services/article.service';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { Observable } from 'rxjs';

@Component({
	selector: 'app-magazine-details',
	imports: [CommonModule, MatCardTitle, MatCard, MatCardContent, MatIconModule, MatButtonModule, MatCardModule],
	templateUrl: './magazine-details.component.html',
	styleUrl: './magazine-details.component.scss'
})
export class MagazineDetailsComponent implements OnInit {

	magazine: GetMagazineDto | null = null;
	articles?: GetArticleWithMagazineDto[] | null = null;
	isAuthenticated$!: Observable<boolean>;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		private magazineService: MagazineService,
		private articleService: ArticleService,
		private dialog: MatDialog,
		private authService: AuthService
	) {
		this.isAuthenticated$ = this.authService.isAuthenticated$;
	 }

	ngOnInit(): void {
		const id = this.route.snapshot.paramMap.get('id');
		if (id) {
			this.loadMagazineWithItsArticles(id);
		}
	}



	openAddArticle(magazineId: any) {
		const dialogRef = this.dialog.open(ArticleFormComponent, {
			width: '90vw',
			data: { magazineId: magazineId }
		});
		dialogRef.afterClosed().subscribe({
			next: result => {
				if (result) {
					this.articleService.addArticle(result).subscribe({
						next: () => this.loadArticlesByMagazineID(magazineId),
						error: (error) => console.error(error)
					});
				}
			}
		})
	}

	openEditArticle(article: GetArticleDto) {
		const dialogRef = this.dialog.open(ArticleFormComponent, {
			width: '90vw',
			data: { article: article }
		});
		dialogRef.afterClosed().subscribe({
			next: result => {
				if (result) {
					// console.log(result);
					this.articleService.updateArticle(result).subscribe({
						next: () => this.loadArticlesByMagazineID(article.magazineId),
						error: (error: any) => console.error(error)
					});
				}
			}
		})
	}

	openDeleteArticleDialog(article: any) {
		const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
			width: '300px',
			data: { title: 'Delete Article', message: `Are you sure you want to delete "${article.title}"?` }
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result === 'delete') {
				this.articleService.deleteArticle(article.id).subscribe(
					{ next: () => this.loadArticlesByMagazineID(article.magazineId) });
			}
		});
	}

	openArticleDetails(id: any) {
		this.router.navigate(['/articles', id]);
	}

	loadMagazineWithItsArticles(id: any): void {
		this.magazineService.getMagazineById(id).subscribe(
			{
				next: (data: GetMagazineDto) => {
					this.magazine = data;
					this.articles = data.articles; // assuming your service returns both
					// console.log(data);
				},
				error: (error) => console.error(error)
			});
	}

	loadArticlesByMagazineID(magazineId: any): void {
		// console.log(magazineId);
		this.articleService.getArticlesByMagazineId(magazineId).subscribe({
			next: (data: GetArticlesDto) => {
				this.articles = data.articles;
				// console.log(data);
			},
			error: (error) => console.error(error)
		});
	}
}
