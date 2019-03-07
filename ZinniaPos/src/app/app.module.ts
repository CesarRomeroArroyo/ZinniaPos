import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { EffectsModule } from '@ngrx/effects';

import { appReducers } from './store/app.reducers';
import { effectArray } from './store/effects/index';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NavBarComponent } from './components/shared/nav-bar/nav-bar.component';
import { LoginComponent } from './components/shared/login/login.component';
import { UsersComponent } from './components/application/users/users.component';
import { DataTableComponent } from './components/shared/data-table/data-table.component';
import { UserComponent } from './components/application/users/user/user.component';
import { InicioComponent } from './components/inicio/inicio.component';
import { ProfilesComponent } from './components/application/profiles/profiles.component';
import { ProfileComponent } from './components/application/profiles/profile/profile.component';

@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    LoginComponent,
    UsersComponent,
    DataTableComponent,
    UserComponent,
    InicioComponent,
    ProfilesComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot( effectArray ),
    StoreDevtoolsModule.instrument({
      maxAge: 25
    })
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
