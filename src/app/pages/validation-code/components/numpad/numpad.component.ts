import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonIcon } from '@ionic/angular/standalone';

@Component({
  selector: 'app-numpad',
  templateUrl: './numpad.component.html',
  styleUrls: ['./numpad.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon
  ]
})
export class NumpadComponent implements OnInit {

  digits = [1, 2, 3, 4, 5, 6, 7, 8, 9, '', 0, 'c'];

  @Output() digitClicked: EventEmitter<number> = new EventEmitter<number>();
  @Output() onRemove: EventEmitter<boolean> = new EventEmitter<boolean>();

  enteredDigits: string = '';

  constructor() {}

  ngOnInit() {}


  onDigitClick(digit: number | string): void {
    if (digit === '') return;

    if (typeof digit === 'string') {
      this.onRemove.emit(true);
    } else {
      this.digitClicked.emit(digit);
    }
  }
}
