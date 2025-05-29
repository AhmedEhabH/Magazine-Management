import { Component, Inject, OnInit, Optional } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { first } from 'rxjs/operators';
import { MagazineService } from '../../services/magazine.service';
import { MatFormFieldModule, MatFormFieldControl } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { CommonModule } from '@angular/common';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog'; // For dialog data and control


@Component({
	selector: 'app-magazine-form',
	imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule, MatInputModule, MatNativeDateModule, MatButtonModule, MatDialogModule],
	providers: [provideNativeDateAdapter()],
	templateUrl: './magazine-form.component.html',
	styleUrl: './magazine-form.component.scss'
})
export class MagazineFormComponent implements OnInit {
	form: FormGroup = new FormGroup({});
	id: string | null = null;
	isAddMode: boolean = true;
	loading = false;
	submitted = false;

	constructor(
		private formBuilder: FormBuilder,
		private route: ActivatedRoute,
		public router: Router,
		private magazineService: MagazineService,
		@Optional() public dialogRef: MatDialogRef<MagazineFormComponent>,
		@Inject(MAT_DIALOG_DATA) public data: any
	) {
		this.form = this.formBuilder.group({
			id: [this.id || ''],
			title: ['', Validators.required],
			issueNumber: [''],
			publicationDate: ['', Validators.required],
			coverImageUrl: [''],
			description: [''],
			editor: [''],
			issn: [''],
			brand: ['']
		});
	}
	ngOnInit(): void {
		// this.id = this.route.snapshot.params['id'];
		// this.isAddMode = !this.id;

		// Initialize the form with required fields

		// If in edit mode, fetch the magazine data and populate the form
		// if (!this.isAddMode) {
		// 	this.magazineService.getMagazineById(this.id)
		// 		.pipe(first())
		// 		.subscribe(magazine => {
		// 			this.form.patchValue(magazine);
		// 			this.loading = false;
		// 		});
		// }
		// Check if data is passed (for edit mode)
		if (this.data && this.data.id) {
			this.id = this.data.id;
			this.isAddMode = false;
			this.form.patchValue(this.data);
		}
	}

	onSubmit() {
		this.submitted = true;
		if (this.form.invalid) {
			return;
		}
		this.loading = true;
		if (this.isAddMode) {
			this.addMagazine();
		} else {
			this.updateMagazine();
		}
	}

	private addMagazine(): void {
		this.magazineService.addMagazine(this.form.value)
			.pipe(first())
			.subscribe({
				next: (result) => {
					this.dialogRef.close(result); // Close dialog and return result
					this.loading = false;
				},
				error: (error: any) => {
					console.error(error);
					this.loading = false;
				}
			});
	}

	private updateMagazine(): void {
		this.magazineService.updateMagazine(this.id, this.form.value)
			.pipe(first())
			.subscribe({
				next: (result) => {
					this.dialogRef.close(result); // Close dialog and return result
					this.loading = false;
				},
				error: (error: any) => {
					console.error(error);
					this.loading = false;
				}
			});
	}

	navigateToMagazines(): void {
		this.router.navigate(['/magazines']);
	}

	onCancel(): void {
		this.dialogRef.close(); // Close dialog without saving
	}
}
