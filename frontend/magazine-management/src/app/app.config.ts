import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideNativeDateAdapter } from '@angular/material/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { authInterceptor } from "./interceptors/auth.interceptor";

export const appConfig: ApplicationConfig = {
	providers: [
		// provideZoneChangeDetection({ eventCoalescing: true }),
		// provideNativeDateAdapter(),
		provideRouter(routes),
		provideHttpClient(withInterceptors([authInterceptor])),
		provideAnimationsAsync()
	],
};
