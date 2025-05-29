import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	private isDarkThemeSubject = new BehaviorSubject<boolean>(false);
	isDarkTheme$ = this.isDarkThemeSubject.asObservable();

	constructor() {
		// Load theme from localStorage or system preference
		const savedTheme = localStorage.getItem('theme');
		const isDark = savedTheme ? savedTheme === 'dark' :
			window.matchMedia('(prefers-color-scheme: dark)').matches;

		this.setTheme(isDark);
	}

	toggleTheme(): void {
		const currentTheme = this.isDarkThemeSubject.value;
		this.setTheme(!currentTheme);
	}

	private setTheme(isDark: boolean): void {
		this.isDarkThemeSubject.next(isDark);
		localStorage.setItem('theme', isDark ? 'dark' : 'light');

		// Apply theme to document
		if (isDark) {
			document.body.classList.add('dark-theme');
		} else {
			document.body.classList.remove('dark-theme');
		}
	}

}
