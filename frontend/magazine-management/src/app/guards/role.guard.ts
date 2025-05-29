import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
	const authService = inject(AuthService);
	const router = inject(Router);

	const requiredRoles = route.data['roles'] as string[];

	if (!authService.isAuthenticated()) {
		router.navigate(['/login']);
		return false;
	}

	if (requiredRoles && !authService.hasAnyRole(requiredRoles)) {
		console.log('You do not have the required role to access this page.');
		console.log(requiredRoles);
		
		router.navigate(['/']);
		return false;
	}

	return true;
};
