import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { IonicModule } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { chevronForwardOutline } from 'ionicons/icons';
import { IMetricCardInputs } from 'src/app/core/interfaces/metric-card.interfaces';

@Component({
  selector: 'app-metric-card',
  templateUrl: './metric-card.component.html',
  styleUrls: ['./metric-card.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
  ]
})
export class MetricCardComponent implements OnInit {

  @Input() metricCardConfig!: IMetricCardInputs;
  @Input() customizedDetailFunction?: () => void;

  constructor() {
    addIcons({
      chevronForwardOutline
    });
  }

  ngOnInit() {}

  public customizedDetailAction() {
    if (this.customizedDetailFunction) {
      this.customizedDetailFunction(); 
    }
  }

}
