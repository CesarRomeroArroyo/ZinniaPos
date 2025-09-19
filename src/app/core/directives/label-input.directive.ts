import { Directive, ElementRef, Input, OnInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appLabelInput]'
})
export class LabelInputDirective implements OnInit {
  @Input('appLabelInput') label: string = '';

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    const labelContainer = this.renderer.createElement('div');

    this.renderer.setStyle(labelContainer, 'color', '#fff'); // Color del texto
    this.renderer.setStyle(labelContainer, 'font-size', '14px'); // Tamaño de fuente
    this.renderer.setStyle(labelContainer, 'font-weight', 'bold'); // Negrita
    this.renderer.setStyle(labelContainer, 'margin-bottom', '4px'); // Espaciado inferior

    this.renderer.setProperty(labelContainer, 'innerHTML', this.label);

    const parent = this.el.nativeElement.closest('ion-item');
    if (parent) {
      this.renderer.insertBefore(parent, labelContainer, this.el.nativeElement);
    }
  }
}
