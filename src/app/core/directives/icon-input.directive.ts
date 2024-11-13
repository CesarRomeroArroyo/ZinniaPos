import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appIconInput]'
})
export class IconInputDirective implements OnInit {

  @Input() iconName!: string;
  private ionInput!: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { 
    this.createIcon();
  }

  ngOnInit(): void {
    const ionIcon = this.renderer.createElement('ion-icon');
    this.renderer.setAttribute(ionIcon, 'slot', 'start');
    this.renderer.setAttribute(ionIcon, 'name', this.iconName);
    this.renderer.setAttribute(ionIcon, 'color', 'secondary');
    this.renderer.appendChild(this.ionInput, ionIcon);
  }

  private createIcon(): void {
    this.ionInput = this.el.nativeElement;
    this.renderer.setAttribute(this.ionInput, 'mode', 'md');
    this.renderer.setAttribute(this.ionInput, 'fill', 'outline');
  }

}
