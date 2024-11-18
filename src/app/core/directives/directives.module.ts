import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconInputDirective } from './icon-input.directive';
import { PasswordInputDirective } from './password-input.directive';

@NgModule({
  declarations: [
    IconInputDirective,
    PasswordInputDirective,
  ],
  exports: [
    IconInputDirective, 
    PasswordInputDirective,
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }