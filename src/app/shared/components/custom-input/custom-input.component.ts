import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-custom-input',
  templateUrl: './custom-input.component.html',
  styleUrls: ['./custom-input.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class CustomInputComponent {
  @Input() value?: string | null = null;
  @Input() label?: string; 
  @Input() labelPlacement?: 'stacked' = 'stacked';
  @Input() placeholder?: string;
  @Input() readonly: boolean = false;
  @Output() onInputClick = new EventEmitter<void>();

  constructor() { }

  onClick(): void {
    this.onInputClick.emit();
  }
}
