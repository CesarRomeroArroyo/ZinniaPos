import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { userModel } from '../../../../models/userModel';
import { ProfileModel } from '../../../../models/profileModel';

import { Store } from '@ngrx/store';
import { AppStore } from 'src/app/store/app.reducers';
import * as fromUserAction from 'src/app/store/actions/users.action';

import Swal from 'sweetalert2';
@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnChanges {
  @Input() user: userModel;
  @Output() saveUser = new EventEmitter()
  perfilSel: string;
  perfiles: ProfileModel[];
  constructor(
    private store: Store<AppStore>
  ) { 
    this.user = new userModel();
  }

  ngOnInit() {
    this.store.select('profiles').subscribe((data)=> {
      console.log(data);
    });
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if(this.user.perfil) {
      this.perfilSel = this.user.perfil.nombre;  
    }
  }

  seleccionarPerfil() {
    this.user.perfil = this.perfiles.filter((data: ProfileModel) => {
      return data.nombre == this.perfilSel;
    })[0];
  }

  guardarUsuario() {
    Swal.fire({
      title: '',
      text: 'Esta seguro de crear el usuario?',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Si',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        if(!this.user.id){
          this.saveUser.emit();
          this.store.dispatch(new fromUserAction.AddUser(this.user));
        } else {
          this.store.dispatch(new fromUserAction.UpdateUser(this.user));
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    })
    
  }

}
