import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-content-card',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './content-card.component.html',
  styleUrls: ['./content-card.component.scss']
})
export class ContentCardComponent {
  @Input() title: string = '';
  @Input() subtitle: string = '';
  @Input() summary: string = '';
  @Input() imageUrl: string = '';
  @Input() date: Date | string | null = null;
  @Input() metadata: { icon: string; text: string; action?: () => void }[] = [];
  @Input() actions: { text: string; icon: string; color?: string; action: () => void }[] = [];
  @Input() loading: boolean = false;
  
  @Output() cardClick = new EventEmitter<void>();
  
  onCardClick(): void {
    this.cardClick.emit();
  }
  
  onMetadataClick(event: Event, action?: () => void): void {
    if (action) {
      event.stopPropagation();
      action();
    }
  }
  
  onActionClick(event: Event, action: () => void): void {
    event.stopPropagation();
    action();
  }
  
  formatDate(date: Date | string | null): string {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
}
