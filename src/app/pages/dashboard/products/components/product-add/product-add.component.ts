import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from './product-add.const';

// (Opcional) cambia por tus servicios reales
type IdLabel = { id: string; label: string };
const DEMO_CATEGORIES: IdLabel[] = [
  { id: 'cat-1', label: 'Bebidas' },
  { id: 'cat-2', label: 'Snacks' },
  { id: 'cat-3', label: 'Limpieza' },
];
const DEMO_SUPPLIERS: IdLabel[] = [
  { id: 'sup-1', label: 'Proveedor A' },
  { id: 'sup-2', label: 'Proveedor B' },
];
const DEMO_TAXES: IdLabel[] = [
  { id: 'tax-1', label: 'IVA 0%' },
  { id: 'tax-2', label: 'IVA 5%' },
  { id: 'tax-3', label: 'IVA 19%' },
];

@Component({
  selector: 'app-product-add',
  standalone: true,
  templateUrl: './product-add.component.html',
  styleUrls: ['./product-add.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
})
export class ProductAddComponent {
  public settingHeader = settingHeader;
  public form!: FormGroup;
  public saving = false;

  // Imagen
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  imagePreview?: string;

  // Sheets
  isCatOpen = false;
  isSupOpen = false;
  isTaxOpen = false;

  categories = DEMO_CATEGORIES;
  suppliers  = DEMO_SUPPLIERS;
  taxes      = DEMO_TAXES;

  // selección temporal para radio-group
  tmpCategoryId?: string;
  tmpSupplierId?: string;
  tmpTaxId?: string;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
  ) {}

  ionViewWillEnter() {
    this.buildForm();
  }

  private buildForm() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
      costPrice: [null, [Validators.required, Validators.min(0)]],
      salePrice: [null, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      categoryId: [null, Validators.required],
      supplierId: [null],
      taxId: [null],
      image: [null], // Base64/URL
    });
  }

  // ===== Imagen =====
  pickImage() {
    this.fileInput?.nativeElement?.click();
  }
  onFileSelected(ev: Event) {
    const input = ev.target as HTMLInputElement;
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result as string;
      this.form.get('image')!.setValue(this.imagePreview);
    };
    reader.readAsDataURL(file);
  }

  // ===== Stepper stock =====
  decStock(ev?: Event) {
    ev?.stopPropagation();
    const cur = Number(this.form.get('stock')!.value || 0);
    this.form.get('stock')!.setValue(Math.max(cur - 1, 0));
  }
  incStock(ev?: Event) {
    ev?.stopPropagation();
    const cur = Number(this.form.get('stock')!.value || 0);
    this.form.get('stock')!.setValue(cur + 1);
  }

  // ===== Labels de selección =====
  get categoryLabel() {
    const id = this.form.get('categoryId')!.value as string | null;
    return this.categories.find(x => x.id === id)?.label ?? 'Categoría';
  }
  get supplierLabel() {
    const id = this.form.get('supplierId')!.value as string | null;
    return this.suppliers.find(x => x.id === id)?.label ?? 'Proveedor';
  }
  get taxLabel() {
    const id = this.form.get('taxId')!.value as string | null;
    return this.taxes.find(x => x.id === id)?.label ?? 'Impuesto';
  }

  // ===== Sheets =====
  openCatSheet() {
    this.tmpCategoryId = this.form.get('categoryId')!.value;
    this.isCatOpen = true;
  }
  openSupSheet() {
    this.tmpSupplierId = this.form.get('supplierId')!.value;
    this.isSupOpen = true;
  }
  openTaxSheet() {
    this.tmpTaxId = this.form.get('taxId')!.value;
    this.isTaxOpen = true;
  }
  closeCat() { this.isCatOpen = false; }
  closeSup() { this.isSupOpen = false; }
  closeTax() { this.isTaxOpen = false; }

  applyCat() { this.form.get('categoryId')!.setValue(this.tmpCategoryId ?? null); this.closeCat(); }
  applySup() { this.form.get('supplierId')!.setValue(this.tmpSupplierId ?? null); this.closeSup(); }
  applyTax() { this.form.get('taxId')!.setValue(this.tmpTaxId ?? null); this.closeTax(); }

  // ===== Submit =====
  onSubmit() {
    if (!this.form || this.form.invalid || this.saving) return;
    this.saving = true;

    // Aquí llamarías a tu ProductService.create(...)
    const payload = this.form.value;
    console.log('Nuevo producto →', payload);

    // Simulación de guardado:
    setTimeout(() => {
      this.saving = false;
      this.modalCtrl.dismiss({ completed: true, product: payload });
    }, 600);
  }
}
