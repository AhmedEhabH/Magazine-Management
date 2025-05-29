import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GetMagazinesDto, GetMagazineDto, UpdateMagazineDto, AddMagazineDto } from '../interfaces/magazine';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
	providedIn: 'root'
})
export class MagazineService {
	private endpoint = 'Magazines/'

	constructor(private http: HttpClient) { }

	getMagazines(): Observable<GetMagazinesDto> {
		return this.http.get<GetMagazinesDto>(`${environment.apiUrl}${this.endpoint}`);
	}

	getMagazineById(id: any): Observable<GetMagazineDto> {
		return this.http.get<GetMagazineDto>(`${environment.apiUrl}${this.endpoint}${id}`);
	}

	deleteMagazine(id: any) {
		return this.http.delete(`${environment.apiUrl}${this.endpoint}${id}`);
	}

	addMagazine(value: AddMagazineDto) {
		return this.http.post<GetMagazineDto>(`${environment.apiUrl}${this.endpoint}`, value);
	}

	updateMagazine(id: string | null, value: UpdateMagazineDto) {
		return this.http.put<GetMagazineDto>(`${environment.apiUrl}${this.endpoint}${id}`, value);
	}

}
