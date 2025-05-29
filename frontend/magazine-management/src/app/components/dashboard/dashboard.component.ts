import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { DashboardService } from '../../services/dashboard.service';
import { DashboardStatsDto } from '../../interfaces/dashboard';
import { CommonModule, JsonPipe } from '@angular/common';
import { CardComponent } from '../card/card.component';

@Component({
	selector: 'app-dashboard',
	imports: [
		CommonModule,
		CardComponent,
		JsonPipe
	],
	templateUrl: './dashboard.component.html',
	styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {
	stats: DashboardStatsDto | null = null;
	loading = true;
	error: string | null = null;
	constructor(
		private authService: AuthService,
		private dashboardService: DashboardService
	) { }
	ngOnInit(): void {
		this.dashboardService.getDashboardStats().subscribe({
			next: (data) => {
				this.stats = data;
				this.loading = false;
			},
			error: (err) => {
				this.error = 'Failed to load dashboard data';
				this.loading = false;
			}
		});
	}


}
