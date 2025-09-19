import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IconInputDirective } from './icon-input.directive';
import { PasswordInputDirective } from './password-input.directive';
import { LabelInputDirective } from './label-input.directive';
import { CustomInputDirective } from './custom-input.directive';

@NgModule({
  declarations: [
    IconInputDirective,
    LabelInputDirective,
    PasswordInputDirective,
    CustomInputDirective
  ],
  exports: [
    IconInputDirective,
    LabelInputDirective,
    PasswordInputDirective,
    CustomInputDirective
  ],
  imports: [
    CommonModule
  ]
})
export class DirectivesModule { }