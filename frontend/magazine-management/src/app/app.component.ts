import { Component, OnInit } from '@angular/core';
import { Router, RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { OverlayContainer } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from './services/auth.service';
import { CommonModule } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { Observable } from 'rxjs';
import { LayoutComponent } from './components/layout/layout.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

@Component({
	selector: 'app-root',
	imports: [
		LayoutComponent,
		RouterOutlet,
		MatIconModule,
		MatToolbarModule,
		MatTooltipModule,
		MatButtonModule,
		MatMenuModule,
		CommonModule,

	],
	templateUrl: './app.component.html',
	styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
	title = 'Magazines Management';
	isDarkTheme = false;
	tab: string = "Home";
	isAuthenticated$!: Observable<boolean>;

	constructor(
		private overlayContainer: OverlayContainer,
		private router: Router,
		public authService: AuthService
	) {
		this.isAuthenticated$ = this.authService.isAuthenticated$;
	}


	ngOnInit() {
		this.isDarkTheme = localStorage.getItem('theme') === 'dark-theme';
		this.authService.checkAuthStatus();
		this.updateTabBasedOnRoute();
	}

	toggleTheme() {
		this.isDarkTheme = !this.isDarkTheme;
		const darkClass = 'dark-theme';
		localStorage.setItem('theme', this.isDarkTheme ? darkClass : 'light');

		if (this.isDarkTheme) {
			this.overlayContainer.getContainerElement().classList.add(darkClass);
		} else {
			this.overlayContainer.getContainerElement().classList.remove(darkClass);
		}
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
		return this.authService.getCurrentUser()?.email || '';
	}

	logout(): void {
		this.authService.logout();
	}



	private updateTabBasedOnRoute() {
		const currentUrl = this.router.url;
		this.tab = currentUrl.startsWith('/magazines') ? "Home" : "Magazines";
	}


}
