import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Observable, Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { ThemeService } from '../../services/theme.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatBadgeModule } from '@angular/material/badge';
import { UserDto } from '../../interfaces/auth';

@Component({
	selector: 'app-header',
	imports: [
		CommonModule,
		MatMenuModule,
		MatIconModule,
		MatToolbarModule,
		MatButtonModule,
		MatMenuModule,
		RouterModule,
		MatDividerModule,
		MatBadgeModule
	],
	templateUrl: './header.component.html',
	styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit, OnDestroy {
	title: string = "Magazines Management";
	isAuthenticated$: Observable<boolean>;
	isDarkTheme: boolean = true;
	tab: string = 'Magazines';

	isMobile: boolean = false;
	notificationCount: number = 3;
	currentUser: UserDto | null = null;

	private destroy$ = new Subject<void>();

	constructor(
		private authService: AuthService,
		private router: Router,
		private themeService: ThemeService
	) {
		this.isAuthenticated$ = this.authService.isAuthenticated$;
		this.checkScreenSize();
		this.loadUserData();

		// Listen to theme changes
		this.themeService.isDarkTheme$.subscribe(isDark => {
			this.isDarkTheme = isDark;
		});

		// Listen to window resize
		window.addEventListener('resize', () => this.checkScreenSize());
	}

	ngOnInit() {
		this.themeService.isDarkTheme$
			.pipe(takeUntil(this.destroy$))
			.subscribe(isDark => {
				this.isDarkTheme = isDark;
			});
	}

	ngOnDestroy(): void {
		this.destroy$.next();
		this.destroy$.complete();
	}

	goHome(): void {
		this.router.navigate(['/home']);
	}

	handleMagazineTabClick() {
		const currentUrl = this.router.url;
		if (currentUrl.startsWith('/magazines')) {
			this.tab = "Magazines";
			this.router.navigate(['/']); // Go to home if already on magazine page
		} else {
			this.tab = "Home";
			this.router.navigate(['/magazines']); // Otherwise, go to magazine page
		}
	}

	canCreateMagazine(): boolean {
		return this.authService.hasRole('Admin') || this.authService.hasRole('Writer');
	}

	getCurrentUserEmail(): string {
		const currentUser = this.authService.getCurrentUser();
		return currentUser?.email || '';
	}

	logout() {
		this.authService.logout();
	}

	toggleTheme() {
		// this.isDarkTheme = !this.isDarkTheme;
		// this.themeService.setTheme(this.isDarkTheme);
		this.themeService.toggleTheme();
	}

	toggleSidebar(): void {
		// Implement sidebar toggle logic
		console.log('Toggle sidebar');
	}

	goToProfile(): void {
		this.router.navigate(['/profile']);
	}

	goToSettings(): void {
		this.router.navigate(['/settings']);
	}

	private checkScreenSize(): void {
		this.isMobile = window.innerWidth < 768;
	}

	private loadUserData(): void {
		// Get user data from auth service
		this.currentUser = this.authService.getCurrentUser();
	}

	login() {
		this.router.navigate(['/login']);
	}

	register() {
		this.router.navigate(['/register']);
	}
}
