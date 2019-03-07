import { Component, OnInit } from '@angular/core';
import { userModel } from 'src/app/models/userModel';
import { Store } from '@ngrx/store';
import { AppStore } from 'src/app/store/app.reducers';
import * as fromUserAction from 'src/app/store/actions/users.action';

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
  constructor(
    private store: Store<AppStore>
  ) {     
    this.user = new userModel;
  }

  ngOnInit() {
    this.store.dispatch(new fromUserAction.ListUsers(this.user));
    this.store.select('users').subscribe((users)=> {
      this.columns = [
        {title: 'Nombre', name: 'nombre'},
        {title: 'Usuario', name: 'usuario'}
      ];
      this.users = users.users;
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
