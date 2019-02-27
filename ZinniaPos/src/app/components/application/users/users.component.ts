import { Component, OnInit } from '@angular/core';
import { userModel } from 'src/app/models/userModel';
import { LocalDataBaseService } from 'src/app/services/local-data-base.service';
import { DatabaseTablesEnum } from '../../../emuns/data-bases-tablesEnum';
declare var $: any;
@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  users: userModel[];
  user: userModel;
  columns: Array<any>;
  numReg: number;
  constructor(private service: LocalDataBaseService) { 
    this.columns = [
      {title: 'Nombre', name: 'nombre'},
      {title: 'Usuario', name: 'usuario'}
    ];
    this.user = new userModel;
  }

  ngOnInit() {
    this.buscarUsuarios();
  }

  buscarUsuarios() {
    this.service.getAll(DatabaseTablesEnum.Users).then((data: userModel[]) => {
      this.columns = [
        {title: 'Nombre', name: 'nombre'},
        {title: 'Usuario', name: 'usuario'}
      ];
      this.users = data;
    });
  }

  nuevoUsuario() {
    this.user = new userModel;
    this.showModal();
  }

  editarUsuario(user) {
    this.user = user;
    
  }

  showModal() {
    $('#exampleModal').modal('show');
  }

  hideModal() {
    $('#exampleModal').modal('hide');
  }

}
