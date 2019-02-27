import { Component, OnInit } from '@angular/core';
import { ProfileModel } from '../../../models/profileModel';
import { LocalDataBaseService } from '../../../services/local-data-base.service';
import { DatabaseTablesEnum } from '../../../emuns/data-bases-tablesEnum';

@Component({
  selector: 'app-profiles',
  templateUrl: './profiles.component.html',
  styleUrls: ['./profiles.component.css']
})
export class ProfilesComponent implements OnInit {
  profiles: ProfileModel[];
  profile: ProfileModel;
  columns: Array<any>;
  numReg: number;
  constructor(private service: LocalDataBaseService) { 
    this.columns = [
      {title: 'Nombre', name: 'nombre'}
    ];
  }

  ngOnInit() {
    this.service.getAll(DatabaseTablesEnum.Profiles).then((data: ProfileModel[]) => {
      this.profiles = data;
    });
  }

}
