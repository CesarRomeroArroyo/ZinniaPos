import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { customerOptionsModalConfig, mapObjectToSelectOptions, mapProductToOrderItem, mapProductToSelectOptions, productOptionsModalConfig, settingHeader } from './create-order.consts';
import { ModalController } from '@ionic/angular/standalone';
import { ICustomer } from 'src/app/core/interfaces/bussiness/customers.interface';
import { IProduct } from 'src/app/core/interfaces/bussiness/product.interface';
import { IOrderItem } from 'src/app/core/interfaces/bussiness/order.interface';
import { OpenSelectOptionsService } from 'src/app/core/services/utils/open-select-options.service';
import { CustomersService } from 'src/app/core/services/bussiness/customers.service';
import { ProductService } from 'src/app/core/services/bussiness/product.service';
import { ISelectOption } from 'src/app/core/interfaces/select-options-modal.interface';
import { addIcons } from 'ionicons';
import { addOutline, removeOutline, trashOutline } from 'ionicons/icons';

@Component({
  selector: 'app-create-order',
  templateUrl: './create-order.component.html',
  styleUrls: ['./create-order.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    HeaderComponent,
    DirectivesModule,
    ReactiveFormsModule,
    CustomInputComponent,
    FormsModule,
  ],
})
export class CreateOrderComponent implements OnInit {

  public clientQuery = '';
  public selectedClient: ICustomer | null = null;

  public subtotal = 0;
  public discount = 0;
  public tax = 0;
  public total = 0;

  public settingHeader = settingHeader;
  public customerForm!: FormGroup;
  public productsForm!: FormGroup;

  public products: IProduct[] = [];
  public orderItems: IOrderItem[] = [];

  private customerOptionsModalConfig = customerOptionsModalConfig;
  private productOptionsModalConfig = productOptionsModalConfig;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalCtrl: ModalController,
    private _productService: ProductService,
    private _customerService: CustomersService,
    private _openSelectOptionsService: OpenSelectOptionsService,
  ) {
    addIcons({
      trashOutline,
      removeOutline,
      addOutline,
    });
    this.buildFormArray();
    this.buildCustomerForm();
    this.buildProductsForm();
  }

  ngOnInit() {
    this.getCustomers();
    this.getProducts();
  }

  public actionCompleted() {
    const data = { completed: true };
    this._modalCtrl.dismiss(data);
  }


  public updateTotals() {
    this.subtotal = this.orderItems.reduce(
      (sum, p) => sum + p.product.salePrice * p.quantity,
      0
    );
  }

  public async openCustomerSelection() {
    const data = await this._openSelectOptionsService.open({ ...customerOptionsModalConfig });
    if (data) { this.customerForm.get('customer')?.setValue(data.value); }
  }

  public async openProductsSelection() {
    const data = await this._openSelectOptionsService.open({ ...productOptionsModalConfig });
    if (data) {
      const selectedIds = data.map((option: ISelectOption) => option.value);
      const filteredProducts = this.products.filter(product => selectedIds.includes(product.id));
      this.orderItems = filteredProducts.map(product => mapProductToOrderItem(product));
      this.updateTotals();
    }
  }

  public removeItemFromOrder(itemId: string) {
    this.orderItems = this.orderItems.filter(p => p.id !== itemId);
    this.updateTotals();
  }

  public increaseQuantity(item: IOrderItem) {
    item.quantity++;
    this.updateTotals();
  }

  public decreaseQuantity(item: IOrderItem) {
    if (item.quantity > 1) { 
      item.quantity--;
      this.updateTotals();
    }
  }

  private buildFormArray(): void {
    this.productsForm = this._formBuilder.group({
      products: this._formBuilder.array([])
    });
  }

  private buildProductsForm(): void {

  }

  private buildCustomerForm(): void {
    this.customerForm = this._formBuilder.group({
      customer: ['', Validators.required]
    });
  }

  private getCustomers() {
    this._customerService.getCustomers("2808").subscribe({
      next: (response) => {
        if(response) {
          this.customerOptionsModalConfig.optionsList = mapObjectToSelectOptions(response);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }

  private getProducts() {
    this._productService.getAllProducts("2808").subscribe({
      next: (response) => {
        if(response) {
          this.products = response;
          this.productOptionsModalConfig.optionsList = mapProductToSelectOptions(response);
        }
      },
      error: (error) => {
        console.error(error);
      }
    });
  }


}
