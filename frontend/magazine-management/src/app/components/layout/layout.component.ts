import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { ThemeService } from '../../services/theme.service';
import { Subject, takeUntil } from 'rxjs';

@Component({
	selector: 'app-layout',
	imports: [
		HeaderComponent
	],
	templateUrl: './layout.component.html',
	styleUrl: './layout.component.scss'
})
export class LayoutComponent implements OnInit, OnDestroy {
	isDarkTheme: boolean = false;
	private destroy$ = new Subject<void>();

	constructor(private themeService: ThemeService) { }

	ngOnInit(): void {
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
}
