import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent {
  @Input() theme: 'dark' | 'light' = 'dark';
  @Input() previewOpen = false;
  @Output() toggleTheme = new EventEmitter<void>();
  @Output() toggleMobilePreview = new EventEmitter<void>();
  @Output() downloadPdf = new EventEmitter<void>();
}
