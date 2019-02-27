import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../../../../models/profileModel';
import { PermissionsModel } from '../../../../models/permissionsModel';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile: ProfileModel;
  permissions: PermissionsModel[];
  permission: PermissionsModel;
  constructor() { 
    this.profile = new ProfileModel();
    this.permissions = [];
  }

  ngOnInit() {
  }

  selectPemission(name){
    const perm = this.permissions.filter((per: PermissionsModel) => {
      return per.menu === name;
    });

    if(perm.length > 0){
      this.permissions = this.permissions.filter((per) => {
        return per.menu !== name;
      });
    } else {
      this.permission = new PermissionsModel();
      this.permission.menu = name;
      this.permissions.push(this.permission);
    }

    this.profile.permisos = this.permissions;
    console.log(this.profile);
  }

}
