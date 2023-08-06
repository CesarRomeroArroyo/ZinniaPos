import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';
import { Platform } from '@ionic/angular';
import { TranslationService } from '../../services/translation.service';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.scss'],
})
export class DataTableComponent implements OnInit {

  @Input() columns: any[] = [];
  @Input() data: any[]= [];
  @Input() options: boolean = false;
  @Input() optionsEdit: boolean = false;
  @Input() optionsDelete: boolean = false;
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();

  public pageRegister: number = 0;
  public pagesNumber: number = 0;
  public registerNumber: number = 0;
  public actualPage: number;
  public currentPage: number;
  public nextPage: number;
  public dataGrid: any[] = [];
  public dataGridGrl: any[] = [];
  public nameSelected: string;
  public orderOrientation: boolean;
  public buscarTxt: string;
  public buscarTipo: string;
  public busquedaActiva: boolean;
  public isMobile= false;
  constructor(
    public translationService: TranslationService,
    private platform: Platform
  ) {
    this.buscarTxt = '';
    this.buscarTipo = '';
    this.busquedaActiva = false;
    this.actualPage = 1;
    this.currentPage = 0;
    this.nextPage = 10;
    this.orderOrientation = true;
    this.nameSelected = '';

    if (!this.optionsEdit) {
      this.optionsEdit = true;
    }
    if (!this.optionsDelete) {
      this.optionsDelete = true;
    }
  }

  ngOnInit() {
    console.log(this.columns);
    console.log(this.platform.platforms());
    if(this.platform.is('desktop')) {
      this.isMobile = false;
    } else {
      this.isMobile = true;
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.pageRegister = 10;
    this.registerNumber = (this.data) ? this.data.length : 0;
    this.pagesNumber = Math.ceil((this.registerNumber / 10));
    this.setDataGrid();

  }

  setDataGrid() {
    // console.log(this.data);
    //this.dataGridGrl = (this.data) ? this.data.slice(this.currentPage, this.nextPage) : [];
    if (this.busquedaActiva) {
      this.dataGrid = (this.dataGridGrl) ? this.dataGridGrl.slice(this.currentPage, this.nextPage) : [];
    } else {
      this.dataGrid = (this.data) ? this.data.slice(this.currentPage, this.nextPage) : [];
    }
  }

  

  buscar() {
    console.log(this.buscarTxt);
    if (this.buscarTxt != '' && this.buscarTipo != '') {
      this.busquedaActiva = true;

      /* this.dataGrid = this.data.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(this.buscarTxt.toLowerCase()) > 0; 
      }); */
      this.busqueda();

      this.dataGridGrl = JSON.parse(JSON.stringify(this.dataGrid));
      this.registerNumber = (this.dataGrid) ? this.dataGrid.length : 0;
      this.pagesNumber = Math.ceil((this.registerNumber / 10));
    } else {
      this.busquedaActiva = false;
      this.registerNumber = (this.data) ? this.data.length : 0;
      this.pagesNumber = Math.ceil((this.registerNumber / 10));
    }
    this.setDataGrid();
  }

  busqueda() {
    var arraySearch = this.buscarTxt.split(" ");

    if (arraySearch.length == 1) {
      this.dataGrid = this.data.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(arraySearch[0].toLowerCase()) > 0;
      });
    }
    if (arraySearch.length == 2) {
      this.dataGrid = this.data.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(arraySearch[0].toLowerCase()) > 0;
      });
      this.dataGrid = this.dataGrid.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(arraySearch[1].toLowerCase()) > 0;
      });
    }
    if (arraySearch.length >= 2) {
      this.dataGrid = this.data.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(arraySearch[0].toLowerCase()) > 0;
      });
      this.dataGrid = this.dataGrid.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(arraySearch[1].toLowerCase()) > 0;
      });
      this.dataGrid = this.dataGrid.filter((data) => {
        return data[this.buscarTipo].toLowerCase().includes(arraySearch[2].toLowerCase()) > 0;
      });
    }

  }

  onEditData(data: any) {
    this.editEvent.emit(data);
  }

  onDeleteData(data: any) {
    this.deleteEvent.emit(data);
  }

  onNextPage() {
    if ((this.actualPage + 1) > this.pagesNumber) {
      this.actualPage = this.pagesNumber;
    } else {
      this.actualPage++;
      this.currentPage = this.currentPage + 10;
      this.nextPage = this.nextPage + 10;
      this.setDataGrid();
    }
  }

  onPreviusPage() {
    if ((this.actualPage - 1) === 0) {
      this.actualPage = 1;
    } else {
      this.actualPage--;
      this.currentPage = this.currentPage - 10;
      this.nextPage = this.nextPage - 10;
      this.setDataGrid();
    }
  }

  onSort(name: any) {
    if (this.nameSelected === '') {
      this.nameSelected = name;
    }
    if (this.nameSelected !== name) {
      this.nameSelected = name;
      this.orderOrientation = true;
    } else {
      this.orderOrientation = !this.orderOrientation;
    }
    if (this.orderOrientation) {
      this.onSortDesc(name);
    } else {
      this.onSortAsc(name);
    }
  }

  onSortDesc(name: any) {
    this.data.sort(function (a, b) {
      if (a[name] > b[name]) {
        return 1;
      }
      if (a[name] < b[name]) {
        return -1;
      }
      return 0;
    });
    this.setDataGrid();
  }

  onSortAsc(name: any) {
    this.data.sort(function (a, b) {
      if (a[name] < b[name]) {
        return 1;
      }
      if (a[name] > b[name]) {
        return -1;
      }
      return 0;
    });
    this.setDataGrid();
  }

}
