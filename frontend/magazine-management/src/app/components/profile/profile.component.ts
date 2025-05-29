// profile.component.ts
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { UserDto } from '../../interfaces/auth';
import { AuthService } from '../../services/auth.service';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';


@Component({
	selector: 'app-profile',
	imports: [
		CommonModule,
		MatCardModule,
		MatFormFieldModule,
		MatInputModule,
		MatButtonModule,
		MatIconModule,
		MatProgressSpinnerModule,
		MatSnackBarModule,
		ReactiveFormsModule,
	],
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
	profileForm: FormGroup;
	user: UserDto | null = null;
	isEditMode = false;
	isLoading = false;
	profileImageUrl: string = '';
	selectedFile: File | null = null;

	// Statistics data
	userStats = {
		totalArticles: 24,
		totalMagazines: 5,
		publishedArticles: 18,
		pendingArticles: 6
	};

	// Recent activity data
	recentActivities = [
		{
			title: 'Article Published',
			description: 'Your article "The Future of Technology" has been published.',
			date: new Date(),
			type: 'published',
			image: 'https://picsum.photos/80/60'
		},
		{
			title: 'Magazine Created',
			description: 'You successfully created a new magazine titled "Tech Insights".',
			date: new Date(Date.now() - 86400000),
			type: 'created',
			image: 'https://picsum.photos/80/60?random=1'
		},
		{
			title: 'Article Submitted',
			description: 'Your article "AI Revolution" has been submitted for review.',
			date: new Date(Date.now() - 172800000),
			type: 'submitted',
			image: 'https://picsum.photos/80/60.jpg'
		}
	];

	constructor(
		private fb: FormBuilder,
		private snackBar: MatSnackBar,
		private authService: AuthService
	) {
		this.profileForm = this.fb.group({
			userName: ['', [Validators.required, Validators.minLength(3)]],
			email: ['', [Validators.required, Validators.email]],

		});
	}

	ngOnInit(): void {
		this.loadUserProfile();
	}

	loadUserProfile(): void {
		this.user = this.authService.getCurrentUser();
		if (this.user) {
			console.log(this.user);

			this.profileForm.patchValue({
				userName: this.user.userName,
				email: this.user.email,
				roles: this.user.roles.join(', ')
			});
		}
	}

	toggleEditMode(): void {
		if (this.isEditMode) {
			this.saveProfile();
		} else {
			this.isEditMode = true;
		}
	}

	cancelEdit(): void {
		this.isEditMode = false;
		this.loadUserProfile();
	}

	saveProfile(): void {
		if (this.profileForm.valid) {
			this.isLoading = true;

			// Simulate API call
			setTimeout(() => {
				this.isLoading = false;
				this.isEditMode = false;
				this.snackBar.open('Profile updated successfully!', 'Close', {
					duration: 3000,
					panelClass: ['success-snackbar']
				});
			}, 1000);
		} else {
			this.snackBar.open('Please fill in all required fields correctly', 'Close', {
				duration: 3000,
				panelClass: ['error-snackbar']
			});
		}
	}

	onImageUpload(event: any): void {
		const file = event.target.files[0];
		if (file) {
			this.selectedFile = file;
			const reader = new FileReader();
			reader.onload = (e: any) => {
				this.profileImageUrl = e.target.result;
			};
			reader.readAsDataURL(file);
		}
	}

	getInitials(): string {
		const firstName = this.profileForm.get('firstName')?.value || '';
		const lastName = this.profileForm.get('lastName')?.value || '';
		const userName = this.profileForm.get('userName')?.value || '';

		if (firstName && lastName) {
			return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
		} else if (userName) {
			return userName.charAt(0).toUpperCase();
		}
		return 'U';
	}

	getFullName(): string {
		const firstName = this.profileForm.get('firstName')?.value || '';
		const lastName = this.profileForm.get('lastName')?.value || '';
		return firstName && lastName ? `${firstName} ${lastName}` : this.profileForm.get('userName')?.value || 'User';
	}

	formatDate(date: Date): string {
		return date.toLocaleDateString();
	}

	getActivityIcon(type: string): string {
		switch (type) {
			case 'published': return 'publish';
			case 'created': return 'create';
			case 'submitted': return 'send';
			default: return 'info';
		}
	}
}
