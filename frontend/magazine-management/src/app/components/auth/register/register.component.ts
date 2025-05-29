import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { passwordMatchValidator, strongPasswordValidator } from '../../../validators/custom-validators';

@Component({
	selector: 'app-register',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		RouterLink
	],
	templateUrl: './register.component.html',
	styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
	registerForm: FormGroup = new FormGroup({});
	isLoading = false;
	hidePassword = true;
	hideConfirmPassword = true;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.registerForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			userName: ['', [Validators.required, Validators.minLength(3)]],
			password: ['', [Validators.required, strongPasswordValidator()]],
			confirmPassword: ['', Validators.required]
		}, {
			validators: passwordMatchValidator('password', 'confirmPassword')
		});
	}
	ngOnInit(): void {
		if (this.authService.isAuthenticated()) {
			this.router.navigate(['/magazines']);
		}
	}

	onSubmit(): void {
		if (this.registerForm.valid) {
			this.isLoading = true;

			this.authService.register(this.registerForm.value).subscribe({
				next: (response) => {
					this.snackBar.open(
						'Account created successfully! Please login with your credentials.',
						'Close',
						{
							duration: 5000,
							panelClass: ['success-snackbar']
						}
					);
					this.router.navigate(['/login']);
				},
				error: (error) => {
					let errorMessage = 'Registration failed. Please try again.';

					if (error.error?.message) {
						errorMessage = error.error.message;
					} else if (error.status === 400) {
						errorMessage = 'Invalid registration data. Please check your inputs.';
					} else if (error.status === 409) {
						errorMessage = 'An account with this email already exists.';
					}

					this.snackBar.open(errorMessage, 'Close', {
						duration: 5000,
						panelClass: ['error-snackbar']
					});
					this.isLoading = false;
				},
				complete: () => {
					this.isLoading = false;
				}
			});
		} else {
			this.markFormGroupTouched();
		}
	}

	getPasswordStrength(): number {
		const password = this.registerForm.get('password')?.value || '';
		let strength = 0;

		if (password.length >= 8) strength += 20;
		if (/[a-z]/.test(password)) strength += 20;
		if (/[A-Z]/.test(password)) strength += 20;
		if (/[0-9]/.test(password)) strength += 20;
		if (/[^A-Za-z0-9]/.test(password)) strength += 20;

		return strength;
	}

	getPasswordStrengthClass(): string {
		const strength = this.getPasswordStrength();
		if (strength < 40) return 'strength-weak';
		if (strength < 80) return 'strength-medium';
		return 'strength-strong';
	}

	getPasswordStrengthText(): string {
		const strength = this.getPasswordStrength();
		if (strength < 40) return 'Weak';
		if (strength < 80) return 'Medium';
		return 'Strong';
	}

	private markFormGroupTouched(): void {
		Object.keys(this.registerForm.controls).forEach(key => {
			const control = this.registerForm.get(key);
			control?.markAsTouched();
		});
	}
}
