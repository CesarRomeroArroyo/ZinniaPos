import { Component, OnInit } from '@angular/core';
import {  Router } from '@angular/router';
import { ChartConfiguration, ChartOptions } from 'chart.js';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.page.html',
  styleUrls: ['./inicio.page.scss'],
})
export class InicioPage implements OnInit {
  title = 'ng2-charts-demo';

  //Bars
  public barChartLegend = true;
  public barChartPlugins = [];

  public barChartData: ChartConfiguration<'bar'>['data'] = {
    labels: [ '2006', '2007', '2008', '2009', '2010', '2011', '2012' ],
    datasets: [
      { data: [ 65, 59, 80, 81, 56, 55, 40 ], label: 'Series A' },
      { data: [ 28, 48, 40, 19, 86, 27, 90 ], label: 'Series B' }
    ]
  };

  public barChartOptions: ChartConfiguration<'bar'>['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
        title: {
          display: true,
          text: this.translationService.translate('_SALES')
      }
    }
  };

  // Pie
  public pieChartOptions: ChartOptions<'pie'> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: this.translationService.translate('_SALES_BY_CATEGORIES')
    }
  }
  };
  public pieChartLabels = [ this.translationService.translate('_DELIVERY'), this.translationService.translate('_TABLES'), this.translationService.translate('_WEB') ];
  public pieChartDatasets = [ {
    data: [ 300, 500, 100 ]
  } ];
  public pieChartLegend = true;
  public pieChartPlugins = [];
  

  constructor(
    public translationService: TranslationService,
    private router: Router
  ) { }

  ngOnInit() {
  }

  goToPOS(){
    this.router.navigate(['dashboard', 'pos'])
  }

  goToAdmin(){
    this.router.navigate(['dashboard', 'items'])
  }

}
