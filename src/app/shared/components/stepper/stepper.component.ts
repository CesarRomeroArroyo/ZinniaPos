import { NgStyle } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-stepper',
  templateUrl: './stepper.component.html',
  styleUrls: ['./stepper.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    NgStyle
  ]
})
export class StepperComponent implements OnInit {

  @Input() totalSteps = 1;
  @Input() currentStep = 1;

  constructor() { }

  ngOnInit() {}
  
  get progressPercent(): string {
    const percent = (this.currentStep / this.totalSteps) * 100;
    return `${Math.max(0, Math.min(percent, 100))}%`;
  }

}
