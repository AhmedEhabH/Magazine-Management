import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
	selector: 'app-login',
	imports: [
		CommonModule,
		ReactiveFormsModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule
	],
	templateUrl: './login.component.html',
	styleUrl: './login.component.scss'
})
export class LoginComponent {
	loginForm: FormGroup = new FormGroup({});
	isLoading = false;

	constructor(
		private fb: FormBuilder,
		private authService: AuthService,
		private router: Router,
		private snackBar: MatSnackBar
	) {
		this.loginForm = this.fb.group({
			email: ['', [Validators.required, Validators.email]],
			password: ['', Validators.required]
		});
	}

	onSubmit(): void {
		if (this.loginForm.valid) {
			this.isLoading = true;
			this.authService.login(this.loginForm.value).subscribe({
				next: () => {
					this.router.navigate(['/magazines']);
					this.snackBar.open('Login successful!', 'Close', { duration: 3000 });
				},
				error: (error) => {
					this.snackBar.open('Login failed. Please check your credentials.', 'Close', { duration: 3000 });
					this.isLoading = false;
				},
				complete: () => {
					this.isLoading = false;
				}
			});
		}
	}
}
