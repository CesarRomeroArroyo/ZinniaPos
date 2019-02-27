import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css']
})
export class DataTableComponent implements OnInit {

  @Input() columns: any[];
  @Input() data: any[];
  @Input() options: boolean;
  @Input() optionsEdit: boolean;
  @Input() optionsDelete: boolean;
  @Output() editEvent = new EventEmitter<any>();
  @Output() deleteEvent = new EventEmitter<any>();

  private pageRegister: number;
  private pagesNumber: number;
  private registerNumber: number;
  private actualPage: number;
  private currentPage: number;
  private nextPage: number;
  private dataGrid: any[];
  private nameSelected: string;
  private orderOrientation: boolean;
  constructor() {
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
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.data.firstChange === false) {
      this.pageRegister = 10;
      this.registerNumber = this.data.length;
      this.pagesNumber = Math.ceil((this.registerNumber / 10));
      this.setDataGrid();
    }
  }

  setDataGrid () {
    this.dataGrid = this.data.slice(this.currentPage, this.nextPage);
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

  onSort(name) {
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

  onSortDesc(name) {
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

  onSortAsc(name) {
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
