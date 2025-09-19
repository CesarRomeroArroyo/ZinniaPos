import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, OnInit, Output, Renderer2 } from '@angular/core';

@Directive({
  selector: '[appCustomInput]'
})
export class CustomInputDirective implements AfterViewInit {

  @Input() readonly: boolean = false;
  @Input() label: string = '';  // Input para la etiqueta del input
  @Input() placeholder: string = '';  // Input para el placeholder
  @Input() formControlName!: string;
  @Output() onInputClick = new EventEmitter<void>();
  @Output() valueChanged = new EventEmitter<any>(); 
  private ionInput!: HTMLInputElement;

  constructor(
    private el: ElementRef,
    private renderer: Renderer2
  ) { 
    
  }

  ngAfterViewInit() {
    const hostElement = this.el.nativeElement;
  
    // Crear el contenedor `ion-item`
    const ionItem = this.renderer.createElement('ion-item');
    this.renderer.setAttribute(ionItem, 'lines', 'none');
    this.renderer.addClass(ionItem, 'bordered-item');
  
    // Clonar el input original para moverlo sin conflictos
    const clonedInput = hostElement.cloneNode(true);
  
    // Agregar clases y atributos al input clonado
    this.renderer.setAttribute(clonedInput, 'mode', 'md');
    this.renderer.setAttribute(clonedInput, 'labelPlacement', 'stacked');
    this.renderer.setAttribute(clonedInput, 'placeholder', this.placeholder);
    this.renderer.setAttribute(clonedInput, 'label', this.label);
    this.renderer.addClass(clonedInput, 'label-floating');
    this.renderer.addClass(clonedInput, 'input-label-placement-stacked');
  
    if (this.readonly) {
      this.renderer.setAttribute(clonedInput, 'readonly', 'true');
    }

    // Reconectar el input clonado al formulario
    if (this.formControlName) {
      this.renderer.setAttribute(clonedInput, 'formControlName', this.formControlName);
    }
  
    // Añadir el input clonado al contenedor
    this.renderer.appendChild(ionItem, clonedInput);
  
    // Crear el icono
    const ionIcon = this.renderer.createElement('ion-icon');
    this.renderer.setAttribute(ionIcon, 'name', 'chevron-forward-outline');
    this.renderer.setAttribute(ionIcon, 'slot', 'end');
    this.renderer.appendChild(ionItem, ionIcon);

    // Escuchar el evento click en el `ion-item` y emitir `onInputClick`
    this.renderer.listen(ionItem, 'click', () => {
      this.onInputClick.emit();
    });

    // Escuchar el evento de cambio de valor en el input
    this.renderer.listen(clonedInput, 'input', (event: Event) => {
      const value = (event.target as HTMLInputElement).value;
      this.valueChanged.emit(value);  // Emitir el nuevo valor
    });
  
    // Reemplazar el elemento original por el nuevo contenedor
    const parent = hostElement.parentNode;
    this.renderer.appendChild(parent, ionItem);
    this.renderer.removeChild(parent, hostElement);

  }

}
