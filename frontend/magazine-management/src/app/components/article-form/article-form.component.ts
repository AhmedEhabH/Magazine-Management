import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule, MatLabel } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
	selector: 'app-article-form',
	imports: [
		CommonModule,
		ReactiveFormsModule, 
		MatButtonModule, 
		MatFormFieldModule, 
		MatDialogModule,
		MatLabel,
		MatInputModule,
		MatDialogModule
	],
	templateUrl: './article-form.component.html',
	styleUrl: './article-form.component.scss'
})
export class ArticleFormComponent implements OnInit {
	articleForm!: FormGroup;
	isEditMode: boolean = false;

	constructor(
		private fb: FormBuilder,
		private dialogRef: MatDialogRef<ArticleFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any,
		private authService: AuthService // Inject AuthService
	) { }

	ngOnInit(): void {
		this.isEditMode = !!this.data?.article;
		const currentUser = this.authService.getCurrentUser(); // Get logged-in user
		this.articleForm = this.fb.group({
			title: [this.data?.article?.title || ''],
			summary: [this.data?.article?.summary || ''],
			content: [this.data?.article?.content || ''],
			author: [{ value: currentUser?.userName || '', disabled: true }, Validators.required], // Set and disable,
			magazineID: [this.data?.magazineId || this.data?.article?.magazineId || ''],
			id: [this.data?.article?.id || null]
		});
	}

	onSave(): void {
		// console.log(this.articleForm.value);
		if (this.articleForm.valid) {
			this.dialogRef.close(this.articleForm.value);
		}
	}

	onCancel(): void {
		this.dialogRef.close();
	}

}
