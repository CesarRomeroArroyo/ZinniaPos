import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appPasswordInput]'
})
export class PasswordInputDirective {

  private iconEye!: HTMLIonIconElement;
  private ionInput!: HTMLInputElement;

  constructor(private renderer: Renderer2, private el: ElementRef) {
    this.createEyeIcon();
  }

  private createEyeIcon(): void {
    this.iconEye = this.renderer.createElement('ion-icon');
    this.renderer.setAttribute(this.iconEye, 'slot', 'end');
    this.renderer.setAttribute(this.iconEye, 'name', 'eye-off-outline');
    this.renderer.setAttribute(this.iconEye, 'color', 'secondary');

    this.ionInput = this.el.nativeElement;
    this.ionInput.type = 'password';
    this.renderer.setAttribute(this.ionInput, 'mode', 'md');
    this.renderer.setAttribute(this.ionInput, 'fill', 'outline');
    this.renderer.appendChild(this.ionInput, this.iconEye);
  }

  @HostListener('click', ['$event.target'])
  onClick(target: any): void {
    if (target === this.iconEye) {
      if (this.ionInput.type === 'password') {
        this.ionInput.type = 'text';
        this.iconEye.setAttribute('name', 'eye-outline');
      } else {
        this.ionInput.type = 'password';
        this.iconEye.setAttribute('name', 'eye-off-outline');
      }
    }
  }
}