import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
	selector: 'app-page-header',
	standalone: true,
	imports: [
		CommonModule,
		MatButtonModule,
		MatIconModule
	],
	templateUrl: './page-header.component.html',
	styleUrls: ['./page-header.component.scss']
})
export class PageHeaderComponent {
	@Input() title: string = '';
	@Input() subtitle: string = '';
	@Input() showActionButton: boolean = false;
	@Input() actionButtonIcon: string = 'add';
	@Input() actionButtonText: string = 'Add New';
	@Input() actionButtonColor: string = 'primary';

	@Input() onActionButtonClick: () => void = () => { };

	handleActionClick(): void {
		this.onActionButtonClick();
	}
}
