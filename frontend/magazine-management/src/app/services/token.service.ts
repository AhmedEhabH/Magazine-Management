import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root'
})
export class TokenService {
	private readonly TOKEN_KEY = 'auth_token';

	constructor() { }

	setToken(token: string): void {
		localStorage.setItem(this.TOKEN_KEY, token);
	}

	getToken(): string | null {
		return localStorage.getItem(this.TOKEN_KEY);
	}

	removeToken(): void {
		localStorage.removeItem(this.TOKEN_KEY);
	}

	isTokenExpired(): boolean {
		const token = this.getToken();
		if (!token) return true;
		try {
			const payload = JSON.parse(atob(token.split('.')[1]));
			const currentTime = Math.floor(Date.now() / 1000);
			return payload.exp < currentTime;
		} catch {
			return true;
		}
	}

	decodeToken(): any {
		const token = this.getToken();
		if (!token) return null;

		try {
			return JSON.parse(atob(token.split('.')[1]));
		} catch {
			return null;
		}
	}
}
