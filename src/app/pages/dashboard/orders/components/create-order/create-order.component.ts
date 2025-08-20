import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { DirectivesModule } from 'src/app/core/directives/directives.module';
import { CustomInputComponent } from 'src/app/shared/components/custom-input/custom-input.component';
import { HeaderComponent } from 'src/app/shared/components/header/header.component';
import { customerOptionsModalConfig, invalidFormMessage, mapObjectToSelectOptions, mapProductToOrderItem, mapProductToSelectOptions, orderCreationMessages, productOptionsModalConfig, settingHeader, waitingMessageCreatingOrder } from './create-order.consts';
import { ModalController } from '@ionic/angular/standalone';
import { ICustomer } from 'src/app/core/interfaces/bussiness/customers.interface';
import { IProduct } from 'src/app/core/interfaces/bussiness/product.interface';
import { IOrder, IOrderItem, IOrderPayload } from 'src/app/core/interfaces/bussiness/order.interface';
import { OpenSelectOptionsService } from 'src/app/core/services/utils/open-select-options.service';
import { CustomersService } from 'src/app/core/services/bussiness/customers.service';
import { ProductService } from 'src/app/core/services/bussiness/product.service';
import { ISelectOption } from 'src/app/core/interfaces/select-options-modal.interface';
import { addIcons } from 'ionicons';
import { addOutline, closeOutline, removeOutline, trashOutline } from 'ionicons/icons';
import { IDiscount } from 'src/app/core/interfaces/bussiness/discount.interface';
import { AddDiscountToOrderComponent } from '../add-discount-to-order/add-discount-to-order.component';
import { DiscountTypeValues } from 'src/app/core/consts/enums/business/discount.enum';
import { OriginOfOrder, OrderStatusValue } from 'src/app/core/consts/enums/business/order.enum';
import { AuthSessionService } from 'src/app/core/services/utils/auth-session.service';
import { IUser } from 'src/app/core/interfaces/bussiness/user.interface';
import { OrderService } from 'src/app/core/services/bussiness/order.service';
import { ToastService } from 'src/app/core/services/utils/toast.service';
import { LoadingService } from 'src/app/core/services/utils/loading.service';

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
  public selectedCustomer!: ICustomer | undefined;

  public subtotal = 0;
  public discount!: IDiscount;
  public estimatedTax = 0;
  public total = 0;

  public settingHeader = settingHeader;
  public customerForm!: FormGroup;
  public productsForm!: FormGroup;

  public customers: ICustomer[] = [];
  public products: IProduct[] = [];
  public orderItems: IOrderItem[] = [];
  public order!: IOrderPayload;

  private _loggedUser: IUser | null = null;
  private customerOptionsModalConfig = customerOptionsModalConfig;
  private productOptionsModalConfig = productOptionsModalConfig;

  constructor(
    private _formBuilder: FormBuilder,
    private _modalCtrl: ModalController,
    private _orderService: OrderService,
    private _toastService: ToastService,
    private _loadingService: LoadingService,
    private _productService: ProductService,
    private _customerService: CustomersService,
    private _authSessionService: AuthSessionService,
    private _openSelectOptionsService: OpenSelectOptionsService,
  ) {
    addIcons({
      trashOutline,
      removeOutline,
      addOutline,
      closeOutline,
    });
    this.buildFormArray();
    this.buildCustomerForm();
    this.buildProductsForm();
  }

  ngOnInit() {
    this._loggedUser = this._authSessionService.getCurrentUser();
    this.initializeOrder();
    this.getCustomers();
    this.getProducts();
  }

  get discountValue(): number {
    if (!this.discount) return 0;

    const value = this.discount.value || 0;
    return this.discount.type === DiscountTypeValues.AMOUNT
      ? value
      : this.subtotal * (value / 100);
  }

  public getImageSrc(product: IProduct): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : 'assets/icon/default-product.svg';
  }

  public isOrderInvalid(): boolean {
    return !this.selectedCustomer || this.orderItems.length === 0;
  }

  public actionCompleted() {
    if (this.isOrderInvalid()) {
      this._toastService.showToast(invalidFormMessage);
      return;
    }

    const data = { completed: true };
    this._modalCtrl.dismiss(data);
  }

  public updateTotals() {
    this.subtotal = this.orderItems.reduce(
      (sum, p) => sum + p.product.salePrice * p.quantity,
      0
    );
    this.calculateOrderTotal();
  }

  public async openCustomerSelection() {
    const data = await this._openSelectOptionsService.open({ ...customerOptionsModalConfig });
    if (data) {
      this.selectedCustomer = this.customers.find(customer => customer.id === data.value);
    }
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

  public async addDiscount() {
    const modal = await this._modalCtrl.create({
      component: AddDiscountToOrderComponent
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if(data) {
      this.discount = data;
      this.updateTotals();
    }
  }

  public removeSelectedCustomer() {
    this.selectedCustomer = undefined;
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

  public async confirmOrder() {
    this.order.userId = this._loggedUser!.idunico;
    this.order.customerId = this.selectedCustomer!.id;
    this.order.items = this.orderItems;
    this.order.discount = this.discountValue;
    this.order.estimatedTax = this.estimatedTax;
    this.order.subtotal = this.subtotal;
    this.order.total = this.total;

    await this._loadingService.showLoading(waitingMessageCreatingOrder);
    this._orderService.saveOrder(this.order).subscribe({
      next: async (response) => {
        await this._loadingService.hideLoading();
        if(response) {
          this.actionCompleted();
          this._toastService.showToast(orderCreationMessages["success"]);
        }else {
          this._toastService.showToast(orderCreationMessages["error"]);
        }
      },
      error: async (error) => {
        await this._loadingService.hideLoading();
        console.error(error);
        this._toastService.showToast(orderCreationMessages["error"]);
      }
    });
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

  private initializeOrder() { 
    this.order = {
      userId: '',
      customerId: '',
      items: [],
      discount: 0,
      estimatedTax: 0,
      subtotal: 0,
      total: 0,
      status: OrderStatusValue.PENDING,
      origin: OriginOfOrder.APPLICATION
    } 
  }

  private calculateOrderTotal() {
    const discountValue = this.discount?.value || 0;

    if(this.discount?.type === DiscountTypeValues.AMOUNT) {
      this.total = (this.subtotal - discountValue) + this.estimatedTax;
    }else if (this.discount?.type === DiscountTypeValues.PERCENTAGE) {
      const percentage = discountValue / 100;
      const discount = this.subtotal * percentage;
      this.total = (this.subtotal - discount) + this.estimatedTax;
    }else {
      this.total = this.subtotal + this.estimatedTax;
    }
  }

  private getCustomers() {
    this._customerService.getCustomers("2808").subscribe({
      next: (response) => {
        if(response) {
          this.customers = response;
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
