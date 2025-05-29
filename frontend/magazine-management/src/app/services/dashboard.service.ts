import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { DashboardStatsDto } from '../interfaces/dashboard';

@Injectable({
	providedIn: 'root'
})
export class DashboardService {
	private endPoint = `${environment.apiUrl}Dashboard/`;
	
	constructor(
		private http: HttpClient
	) { }

	getDashboardStats(): Observable<DashboardStatsDto> {
		return this.http.get<DashboardStatsDto>(`${this.endPoint}statistics`);
	}
}
