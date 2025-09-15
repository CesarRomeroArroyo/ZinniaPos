// imports originales...
import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy, inject } from "@angular/core";
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from "@angular/forms";
import { IonicModule } from "@ionic/angular";
import { ModalController } from "@ionic/angular/standalone";
import { firstValueFrom, Subject } from "rxjs";

import { DirectivesModule } from "src/app/core/directives/directives.module";
import { CustomInputComponent } from "src/app/shared/components/custom-input/custom-input.component";
import { HeaderComponent } from "src/app/shared/components/header/header.component";

import {
  customerOptionsModalConfig,
  invalidFormMessage,
  mapObjectToSelectOptions,
  mapProductToOrderItem,
  mapProductToSelectOptions,
  orderCreationMessages,
  productOptionsModalConfig,
  settingHeader,
  waitingMessageCreatingOrder,
} from "./create-order.consts";

import { ICustomer } from "src/app/core/interfaces/bussiness/customers.interface";
import { IProduct } from "src/app/core/interfaces/bussiness/product.interface";
import {
  IOrderItem,
  IOrderPayload,
} from "src/app/core/interfaces/bussiness/order.interface";
import { ISelectOption } from "src/app/core/interfaces/select-options-modal.interface";
import { IDiscount } from "src/app/core/interfaces/bussiness/discount.interface";

import { AddDiscountToOrderComponent } from "../add-discount-to-order/add-discount-to-order.component";
import { DiscountTypeValues } from "src/app/core/consts/enums/business/discount.enum";
import {
  OriginOfOrder,
  OrderStatusValue,
} from "src/app/core/consts/enums/business/order.enum";

import { OpenSelectOptionsService } from "src/app/core/services/utils/open-select-options.service";

// Servicios reales
import {
  ClientesService,
  ClienteApi,
} from "src/app/core/services/bussiness/clientes.service";
import { ProductService } from "src/app/core/services/bussiness/product.service";
import {
  OrderService,
  // 👇 usa el DTO real exportado por order.service.ts
  CreatePedidoDto,
} from "src/app/core/services/bussiness/order.service";
import { AuthSessionService } from "src/app/core/services/utils/auth-session.service";
import { ToastService } from "src/app/core/services/utils/toast.service";
import { LoadingService } from "src/app/core/services/utils/loading.service";

import { addIcons } from "ionicons";
import {
  addOutline,
  closeOutline,
  removeOutline,
  trashOutline,
} from "ionicons/icons";
import { IUser } from "src/app/core/interfaces/bussiness/user.interface";

@Component({
  selector: "app-create-order",
  templateUrl: "./create-order.component.html",
  styleUrls: ["./create-order.component.scss"],
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
export class CreateOrderComponent implements OnInit, OnDestroy {
  // ===== Inyección =====
  private _formBuilder = inject(FormBuilder);
  private _modalCtrl = inject(ModalController);
  private _orderService = inject(OrderService);
  private _toastService = inject(ToastService);
  private _loadingService = inject(LoadingService);
  private _productService = inject(ProductService);
  private _clientesService = inject(ClientesService);
  private _authSessionService = inject(AuthSessionService);
  private _openSelectOptionsService = inject(OpenSelectOptionsService);

  // ===== Estado =====
  public clientQuery = "";
  public selectedCustomer: ICustomer | undefined;

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
  private _destroy$ = new Subject<void>();

  // Clonar configs para mutar optionsList sin tocar el objeto importado
  private customerOptionsModalCfg = { ...customerOptionsModalConfig };
  private productOptionsModalCfg = { ...productOptionsModalConfig };

  ngOnInit() {
    addIcons({ trashOutline, removeOutline, addOutline, closeOutline });

    this.buildFormArray();
    this.buildCustomerForm();
    this.buildProductsForm();

    this._loggedUser = this._authSessionService.getCurrentUser();
    this.initializeOrder();

    // Carga clientes + productos desde BD
    this.loadLookupsFromDB();
  }

  ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  // ================== TOTALES ==================
  get discountValue(): number {
    if (!this.discount) return 0;
    const value = this.discount.value || 0;
    return this.discount.type === DiscountTypeValues.AMOUNT
      ? value
      : this.subtotal * (value / 100);
  }

  public updateTotals() {
    this.subtotal = this.orderItems.reduce(
      (sum, p) => sum + p.product.salePrice * p.quantity,
      0
    );
    this.calculateOrderTotal();
  }

  private calculateOrderTotal() {
    const discountValue = this.discount?.value || 0;

    if (this.discount?.type === DiscountTypeValues.AMOUNT) {
      this.total = this.subtotal - discountValue + this.estimatedTax;
    } else if (this.discount?.type === DiscountTypeValues.PERCENTAGE) {
      const percentage = discountValue / 100;
      const discount = this.subtotal * percentage;
      this.total = this.subtotal - discount + this.estimatedTax;
    } else {
      this.total = this.subtotal + this.estimatedTax;
    }
  }

  // ================== UI/ACCIONES ==================
  public getImageSrc(product: IProduct): string {
    return product.images && product.images.length > 0
      ? product.images[0]
      : "assets/icon/default-product.svg";
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

  public async openCustomerSelection() {
    const data = await this._openSelectOptionsService.open({
      ...this.customerOptionsModalCfg,
    });
    if (data) {
      this.selectedCustomer = this.customers.find(
        (customer) => customer.id === data.value
      );
    }
  }

  public async openProductsSelection() {
    const data = await this._openSelectOptionsService.open({
      ...this.productOptionsModalCfg,
    });
    if (!data) return;

    const selectedIds = data.map((option: ISelectOption) => option.value);
    const filteredProducts = this.products.filter((product) =>
      selectedIds.includes(product.id)
    );

    // Mapea y asegura salePrice numérico por si llega como string
    this.orderItems = filteredProducts.map((product) => {
      const item = mapProductToOrderItem(product);
      item.product.salePrice = this.toNumberPrice(
        (item.product as any).salePrice ??
          (product as any).precio ??
          (product as any).price
      );
      return item;
    });

    this.updateTotals();
  }

  public async addDiscount() {
    const modal = await this._modalCtrl.create({
      component: AddDiscountToOrderComponent,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();

    if (data) {
      this.discount = data;
      this.updateTotals();
    }
  }

  public removeSelectedCustomer() {
    this.selectedCustomer = undefined;
  }

  public removeItemFromOrder(itemId: string) {
    this.orderItems = this.orderItems.filter((p) => p.id !== itemId);
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

  /** Utilidad local */
  private onlyDigits(t: string) {
    return (t || "").toString().replace(/\D/g, "");
  }

  /** 🧱 Construye el payload exacto que requiere el backend */
  private buildCreatePayload(): CreatePedidoDto {
    const clienteId = this.selectedCustomer?.id as any; // puede venir string/number
    const phone = this.onlyDigits(this.selectedCustomer?.mobile || "");

    const items = this.orderItems.map((it) => ({
      producto_id: Number((it.product as any).id ?? it.product.id),
      cantidad: Number(it.quantity),
    }));

    return {
      cliente_id: clienteId,
      numero_celular: phone,
      items,
      // estado: 'pendiente' // descomenta si tu API lo necesita
    };
  }

  public async confirmOrder() {
    if (this.isOrderInvalid()) {
      this._toastService.showToast(invalidFormMessage);
      return;
    }

    // (opcional) rellena tu payload local
    this.order.userId = this._loggedUser?.idunico ?? "";
    this.order.customerId = this.selectedCustomer!.id;
    this.order.items = this.orderItems;
    this.order.discount = this.discountValue;
    this.order.estimatedTax = this.estimatedTax;
    this.order.subtotal = this.subtotal;
    this.order.total = this.total;

    // ✅ payload exacto para el backend (urlencoded en OrderService)
    const payload = this.buildCreatePayload();

    await this._loadingService.showLoading(waitingMessageCreatingOrder);
    try {
      const res = await this._orderService.createPedido(payload);
      console.log("[CreatePedido] result:", res);

      await this._loadingService.hideLoading();
      this._toastService.showToast(orderCreationMessages["success"]);
      this.actionCompleted();
    } catch (e: any) {
      await this._loadingService.hideLoading();
      console.error("[CreatePedido] error →", e);
      const msg =
        (e?.error?.message as string) ||
        (e?.message as string) ||
        "No se pudo crear el pedido";
      this._toastService.showToast({ message: msg, color: "danger" });
    }
  }

  // ================== FORM ==================
  private buildFormArray(): void {
    this.productsForm = this._formBuilder.group({
      products: this._formBuilder.array([]),
    });
  }
  private buildProductsForm(): void {}
  private buildCustomerForm(): void {
    this.customerForm = this._formBuilder.group({
      customer: ["", Validators.required],
    });
  }
  private initializeOrder() {
    this.order = {
      userId: "",
      customerId: "",
      items: [],
      discount: 0,
      estimatedTax: 0,
      subtotal: 0,
      total: 0,
      status: OrderStatusValue.PENDING,
      origin: OriginOfOrder.APPLICATION,
    };
  }

  // ================== CARGA DE DATOS (BD) ==================
  private mapClienteApiToICustomer = (c: ClienteApi): ICustomer => ({
    id: c.id,
    fullname: c.nombre ?? "",
    email: c.correo ?? "",
    mobile: c.telefono ?? "",
    address: c.direccion ?? "",
  });

  private getCompanyId(): string {
    const company = this._authSessionService.getUserCompany?.() as any;
    return (
      company?.id ??
      company?.idunico ??
      company?.codigo ??
      ""
    )?.toString();
  }

  private toNumberPrice(v: any): number {
    if (v == null) return 0;
    if (typeof v === "number") return v;

    if (typeof v === "string") {
      const s = v.trim();
      if (s.includes(",") && s.match(/,\d{1,2}$/)) {
        const normalized = s
          .replace(/\./g, "")
          .replace(",", ".")
          .replace(/[^\d.]/g, "");
        const n = Number(normalized);
        return isNaN(n) ? 0 : n;
      }
      const cleaned = s.replace(/[^0-9.]/g, "");
      const n = Number(cleaned);
      return isNaN(n) ? 0 : n;
    }

    const n = Number(v);
    return isNaN(n) ? 0 : n;
  }

  private normalizeProductsPrices(): void {
    this.products = (this.products ?? []).map((p: any) => {
      const priceNum = this.toNumberPrice(p.salePrice ?? p.precio ?? p.price);
      return {
        ...p,
        name: p.name ?? p.nombre ?? "",
        salePrice: priceNum,
        price: priceNum,
      } as IProduct & { price: number };
    });
  }

  private async fetchProducts(companyId?: string): Promise<IProduct[]> {
    try {
      const prods = await firstValueFrom(
        this._productService.getAllProducts(companyId)
      );
      if (prods && prods.length) return prods;
    } catch {}
    const rawList = await this._productService.getAll();
    return rawList.map(this._productService.toIProduct);
  }

  private async loadLookupsFromDB(): Promise<void> {
    const companyId = this.getCompanyId() || undefined;

    try {
      await this._loadingService.showLoading("Cargando catálogo...");

      const clientesApi = await this._clientesService.getClientes();
      this.customers = (clientesApi ?? []).map(this.mapClienteApiToICustomer);

      this.products = await this.fetchProducts(companyId);
      this.normalizeProductsPrices();

      this.customerOptionsModalCfg = {
        ...this.customerOptionsModalCfg,
        optionsList: mapObjectToSelectOptions(this.customers),
      };
      this.productOptionsModalCfg = {
        ...this.productOptionsModalCfg,
        optionsList: mapProductToSelectOptions(this.products),
      };
    } catch (err) {
      console.error(err);
      this._toastService.showToast({
        message: "No se pudo cargar clientes/productos.",
        color: "danger",
      });
    } finally {
      await this._loadingService.hideLoading();
    }
  }

  // trackBy para rendimiento
  trackByItemId = (_: number, it: IOrderItem) => it.id;
}
