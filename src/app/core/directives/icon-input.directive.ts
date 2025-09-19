import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appIconInput]'
})
export class IconInputDirective implements OnInit {

  @Input() iconName!: string;
  @Input() iconPosition: 'start' | 'end' = 'end';
  @Input() labelText: string = '';
  private ionInput!: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { 
    this.createIcon();
  }

  ngOnInit(): void {
    const ionIcon = this.renderer.createElement('ion-icon');
    this.renderer.setAttribute(ionIcon, 'slot', this.iconPosition);
    this.renderer.setAttribute(ionIcon, 'name', this.iconName);
    this.renderer.setAttribute(ionIcon, 'color', 'secondary');
    this.renderer.appendChild(this.ionInput, ionIcon);

    const label = this.renderer.createElement('label');
    this.renderer.addClass(label, 'label-stacked');
    const parent = this.el.nativeElement.parentNode;
    this.renderer.insertBefore(parent, label, this.el.nativeElement);
  }

  private createIcon(): void {
    this.ionInput = this.el.nativeElement;
    this.renderer.setAttribute(this.ionInput, 'mode', 'md');
    this.renderer.setAttribute(this.ionInput, 'fill', 'outline');
  }

}
