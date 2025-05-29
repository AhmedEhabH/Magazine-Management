import { Component, Inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogTitle, MatDialogActions, MatDialogContent } from '@angular/material/dialog';

@Component({
	selector: 'app-confirm-delete-dialog',
	imports: [
		MatDialogTitle,
		MatButton,
		MatDialogActions,
		MatDialogContent
	],
	templateUrl: './confirm-delete-dialog.component.html',
	styleUrl: './confirm-delete-dialog.component.scss'
})
export class ConfirmDeleteDialogComponent {
	constructor(
		public dialogRef: MatDialogRef<ConfirmDeleteDialogComponent>,
		@Inject(MAT_DIALOG_DATA) public data: { title?: string; message?: string }
	) { }

	onCancel(): void {
		this.dialogRef.close('cancel');
	}

	onConfirm(): void {
		this.dialogRef.close('delete');
	}
}
