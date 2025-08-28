import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule, ModalController } from '@ionic/angular';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { settingHeader } from '././product-category.consts';

// Servicio sugerido (ajusta la ruta si ya lo tienes en otro lugar)
import { ProductCategoryService } from 'src/app/core/services/bussiness/product-category.service';

@Component({
  selector: 'app-product-category',
  standalone: true,
  templateUrl: './product-category.component.html',
  styleUrls: ['./product-category.component.scss'],
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    ReactiveFormsModule,
    FormsModule,
    RouterModule,
  ],
})
export class ProductCategoryComponent {

  public settingHeader = settingHeader;
  public categoryForm!: FormGroup;
  public saving = false;

  constructor(
    private fb: FormBuilder,
    private modalCtrl: ModalController,
    private categoryService: ProductCategoryService, // implementa saveCategory(...)
  ) {}

  ionViewWillEnter() {
    this.buildForm();
  }

  private buildForm(): void {
    this.categoryForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      description: [''],
    });
  }

  public async onSubmit() {
    if (!this.categoryForm || this.categoryForm.invalid || this.saving) return;

    this.saving = true;
    const payload = this.categoryForm.value;

    // Guarda usando tu servicio (ajusta a tu API)
    this.categoryService.saveCategory(payload).subscribe({
      next: (ok: boolean) => {
        this.saving = false;
        if (ok) {
          this.modalCtrl.dismiss({ completed: true, category: payload });
        }
      },
      error: (err) => {
        console.error(err);
        this.saving = false;
      }
    });
  }
}
