import { Component, OnInit, Input, OnChanges, SimpleChanges, EventEmitter, Output } from '@angular/core';
import { userModel } from '../../../../models/userModel';
import { LocalDataBaseService } from '../../../../services/local-data-base.service';
import { ProfileModel } from '../../../../models/profileModel';
import { DatabaseTablesEnum } from '../../../../emuns/data-bases-tablesEnum';
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
  constructor(private service: LocalDataBaseService) { 
    this.user = new userModel();
  }

  ngOnInit() {
    /*this.service.getAll(DatabaseTablesEnum.Profiles).susbcribe((data: ProfileModel[]) => {
      this.perfiles = data;
    });*/
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
          this.service.add(DatabaseTablesEnum.Users, this.user)
          .then(() => {
            
            Swal.fire(
              '',
              'Se Agregaron los datos correctamente',
              'success'
            )
          })
          .catch((err) => {
            Swal.fire(
              '',
              'Ocurrio un error al crear el usuario: ' + err,
              'error'
            )
          });
        } else {
          this.service.uptade(DatabaseTablesEnum.Users, this.user)
          .then(() => {
            this.saveUser.emit();
            Swal.fire(
              '',
              'Se actualizaron los datos correctamente',
              'success'
            )
          })
          .catch((err) => {
            Swal.fire(
              '',
              'Ocurrio un error al crear el usuario: ' + err,
              'error'
            )
          });
        }
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        
      }
    })
    
  }

}
