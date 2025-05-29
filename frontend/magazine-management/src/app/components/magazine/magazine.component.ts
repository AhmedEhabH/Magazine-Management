import { Component, OnDestroy, OnInit } from '@angular/core';
import { MagazineService } from '../../services/magazine.service';
import { GetMagazinesDto, GetMagazineDto } from '../../interfaces/magazine';

import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NavigationEnd, Router } from '@angular/router';
import { filter, first, Observable, Subject, takeUntil } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { MagazineFormComponent } from '../magazine-form/magazine-form.component';
import { ConfirmDeleteDialogComponent } from '../confirm-delete-dialog/confirm-delete-dialog.component';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-magazine',
	standalone: true,
	imports: [CommonModule, MatCardModule,
		MatButtonModule,
		MatIconModule],
	templateUrl: './magazine.component.html',
	styleUrl: './magazine.component.scss'
})
export class MagazineComponent implements OnInit, OnDestroy {
	magazines: any[] = [];
	totalCount: number = 0;
	private loaded = false; // Flag to prevent duplicate loading
	private destroy$ = new Subject<void>(); // For unsubscribing
	isAuthenticated$!: Observable<boolean>;

	constructor(
		private magazineService: MagazineService,
		private authService: AuthService,
		private router: Router,
		private dialog: MatDialog,
	) { 
		this.isAuthenticated$ = this.authService.isAuthenticated$;
	}

	ngOnInit() {
		this.getMagazines();
	}
	getMagazines() {
		this.magazineService.getMagazines()
			.pipe(first(), takeUntil(this.destroy$))
			.subscribe({
				next: (response) => {
					this.magazines = response.magazines;
					this.totalCount = response.totalCount;
					// console.log('Magazines loaded:', this.magazines);
				},
				error: (error) => {
					console.error('Error loading magazines:', error);
				}
			})
	}

	openAddMagazine() {
		const dialogRef = this.dialog.open(MagazineFormComponent, {
			width: '90vw',
			maxWidth: '400px',
		});

		dialogRef.afterClosed().subscribe(result => {
			// console.log('Dialog closed with result:', result);
			this.getMagazines();
		});
	}

	openEditMagazine(magazine: GetMagazineDto) {
		// this.router.navigate(['/magazine-form', { id: magazine.id }]);
		const dialogRef = this.dialog.open(MagazineFormComponent, {
			width: '90vw',
			maxWidth: '400px',
			data: magazine // Pass data if needed
		});

		dialogRef.afterClosed().subscribe(result => {
			console.log('Dialog closed with result:', result);
			this.getMagazines();
		});
	}

	deleteMagazine(magazine: any) {
		const dialogRef = this.dialog.open(ConfirmDeleteDialogComponent, {
			width: '350px',
			data: {
				title: 'Delete Magazine',
				message: `Are you sure you want to delete "${magazine.title}"?`
			}
		});

		dialogRef.afterClosed().subscribe(result => {
			if (result === 'delete') {
				this.magazineService.deleteMagazine(magazine.id).subscribe({
					next: () => this.getMagazines(),
					error: (error) => console.error(error)
				});
			}
		});
	}

	openMagazineDetails(id: string) {
		this.router.navigate(['/magazines', id]);
	}

	canCreateMagazine(): boolean {
		return this.authService.hasRole('Admin') || this.authService.hasRole('Writer');
	}

	canEditMagazine(): boolean {
		return this.authService.hasRole('Admin') || this.authService.hasRole('Writer');
	}

	canDeleteMagazine(): boolean {
		return this.authService.hasRole('Admin');
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}
}
