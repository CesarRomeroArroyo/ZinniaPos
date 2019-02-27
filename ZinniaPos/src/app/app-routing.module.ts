import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { InicioComponent } from './components/inicio/inicio.component';
import { UsersComponent } from './components/application/users/users.component';
import { UserComponent } from './components/application/users/user/user.component';
import { ProfilesComponent } from './components/application/profiles/profiles.component';
import { ProfileComponent } from './components/application/profiles/profile/profile.component';

const routes: Routes = [
  {path: '', component: InicioComponent},
  {path: 'users', component: UsersComponent},
  {path: 'user', component: UserComponent},
  {path: 'profiles', component: ProfilesComponent},
  {path: 'profile', component: ProfileComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
