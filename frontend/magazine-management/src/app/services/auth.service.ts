import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { AuthResponseDto, DecodedToken, LoginDto, RegisterDto, RegisterResponse, UserDto } from '../interfaces/auth';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable({
	providedIn: 'root'
})
export class AuthService {
	private readonly API_URL = `${environment.apiUrl}Auth/`
	private currentUserSubject = new BehaviorSubject<UserDto | null>(null);
	private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

	public currentUser$ = this.currentUserSubject.asObservable();
	public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();


	constructor(
		private http: HttpClient,
		private tokenService: TokenService,
		private router: Router
	) {
		this.checkAuthStatus();
	}

	login(credentials: LoginDto): Observable<AuthResponseDto> {
		return this.http.post<AuthResponseDto>(`${this.API_URL}login`, credentials)
			.pipe(
				tap(response => {
					this.tokenService.setToken(response.token);
					this.setCurrentUser();
				})
			);
	}

	register(userData: RegisterDto): Observable<RegisterResponse> {
		const { confirmPassword, ...registerData } = userData;
		return this.http.post<RegisterResponse>(`${this.API_URL}register`, registerData);
	}

	logout(): void {
		this.tokenService.removeToken();
		this.currentUserSubject.next(null);
		this.isAuthenticatedSubject.next(false);
		this.router.navigate(['/']);
	}

	checkAuthStatus(): void {
		const token = this.tokenService.getToken();
		if (token && !this.tokenService.isTokenExpired()) {
			this.setCurrentUser();
		} else {
			this.logout();
		}
	}

	private CLAIM_MAP: Record<string, string> = {
		"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": "name",
		"http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress": "email",
		"http://schemas.microsoft.com/ws/2008/06/identity/claims/role": "role"
	};

	mapClaims(decoded: any): any {
		const mapped: any = { ...decoded };
		for (const [full, short] of Object.entries(this.CLAIM_MAP)) {
			if (decoded[full]) {
				mapped[short] = decoded[full];
			}
		}
		return mapped;
	}


	private setCurrentUser(): void {
		const decodedToken: DecodedToken = this.tokenService.decodeToken();
		// console.log(decodedToken);
		const maped:DecodedToken = this.mapClaims(decodedToken);
		// console.log(maped);
		
		if (maped) {
			const user: UserDto = {
				// id: decodedToken.id, // Ensure your DecodedToken includes 'id'
				userName: maped.name,
				email: maped.email,
				// emailConfirmed: decodedToken.emailConfirmed ?? false, // Provide default if missing
				// lockoutEnabled: decodedToken.lockoutEnabled ?? false, // Provide default if missing
				roles: Array.isArray(maped.role) ? maped.role : [maped.role],
				// lockoutEnd: decodedToken.lockoutEnd ?? undefined,
				// createdDate: decodedToken.createdDate ?? undefined,
			};
			this.currentUserSubject.next(user);
			this.isAuthenticatedSubject.next(true);
		}
	}

	hasRole(role: string): boolean {
		const user = this.currentUserSubject.value;
		return user?.roles?.includes(role) || false;
	}

	hasAnyRole(roles: string[]): boolean {
		const user = this.currentUserSubject.value;
		console.log(user);

		return roles.some(role => user?.roles?.includes(role)) || false;
	}

	getCurrentUser(): UserDto | null {
		return this.currentUserSubject.value;
	}

	isAuthenticated(): boolean {
		return this.isAuthenticatedSubject.value;
	}

}
