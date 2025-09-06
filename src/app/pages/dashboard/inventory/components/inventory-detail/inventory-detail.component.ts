import { CommonModule } from '@angular/common';
import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonicModule, AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, ProductApi } from 'src/app/core/services/bussiness/product.service';
import { FormsModule } from '@angular/forms';


type Status = 'Activo' | 'Inactivo';

interface UIInventoryDetail {
  id: string;
  name: string;
  status: Status;
  description?: string | null;
  categoryName?: string | null;
  images: string[];

  // inventario
  stockAvailable: number;     // Disponible
  stockReserved: number;      // Reservado
  stockOnHand: number;        // Existencias (disponible + reservado o stock_actual)
  stockMin: number;           // Stock mínimo
  minAlertEnabled: boolean;   // Alerta de stock mínimo

  // opcional (si quieres mostrar)
  salePrice?: number | null;
  costPrice?: number | null;
  providerName?: string | null;
}

@Component({
  selector: 'app-inventory-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule, FormsModule],
  templateUrl: './inventory-detail.component.html',
  styleUrls: ['./inventory-detail.component.scss'],
})
export class InventoryDetailComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private productsSrv: ProductService,
    private alertCtrl: AlertController,
    private actionSheet: ActionSheetController,
    private toast: ToastController
  ) {}

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  loading = true;
  error?: string;
  item?: UIInventoryDetail;

  selectedIndex = 0;
  get heroImage(): string | null {
    return this.item?.images?.[this.selectedIndex] ?? null;
  }

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (!id) {
        this.error = 'Falta el id.';
        this.loading = false;
        return;
      }
      this.loadItem(id);
    });
  }

  ngOnDestroy(): void { this.sub?.unsubscribe(); }

  // ===== Helpers =====
  private toNum(v: any, fallback = 0): number {
    if (v === null || v === undefined || v === '') return fallback;
    if (typeof v === 'number') return isFinite(v) ? v : fallback;
    const s = String(v).trim();
    const normalized =
      s.includes(',') && s.includes('.') ? s.replace(/\./g, '').replace(',', '.') :
      s.includes(',') ? s.replace(',', '.') : s;
    const n = parseFloat(normalized);
    return isFinite(n) ? n : fallback;
  }
  private truthy(v: any): boolean {
    const s = String(v ?? '').toLowerCase();
    return v === true || v === 1 || s === '1' || s === 'true' || s === 'activo' || s === 'enabled';
  }
  private statusToText(v: any): Status { return this.truthy(v) ? 'Activo' : 'Inactivo'; }
  private first<T = any>(...vals: T[]): T | null {
    for (const v of vals) if (v !== undefined && v !== null && v !== '') return v;
    return null;
  }
  private collectImages(p: any): string[] {
    const arr = this.first<any[]>(
      Array.isArray(p?.imagenes) ? p.imagenes : null,
      Array.isArray(p?.images) ? p.images : null,
      Array.isArray(p?.fotos) ? p.fotos : null,
    ) || [];
    const single = this.first<string>(p?.imagen, p?.image, p?.url_imagen, p?.urlImagen);
    const out: string[] = [];
    if (arr?.length) out.push(...arr.filter(Boolean));
    if (single) out.push(single);
    return out;
  }

  private mapToUI(p: ProductApi): UIInventoryDetail {
    const anyP: any = p;

    const stockActual = this.toNum(this.first(anyP.stock_actual, anyP.stock, anyP.existencias), 0);
    const stockReservado = this.toNum(this.first(anyP.stock_reservado, anyP.reservado), 0);
    const stockDisponible = this.toNum(this.first(anyP.stock_disponible), stockActual - stockReservado);
    const stockOnHand = this.toNum(this.first(anyP.stock_on_hand, anyP.existencias), stockDisponible + stockReservado);

    return {
      id: String(this.first(anyP.id, anyP._id, anyP.codigo, '')),
      name: String(this.first(anyP.nombre, anyP.name, 'Producto')),
      status: this.statusToText(this.first(anyP.estado, anyP.status, true)),
      description: this.first(anyP.descripcion, anyP.description),
      categoryName: this.first(
        anyP.categoria_nombre, anyP.category_name,
        anyP.categoria?.nombre, anyP.categoria?.name,
        anyP.category?.nombre, anyP.category?.name
      ),

      salePrice: this.toNum(this.first(anyP.precio_venta, anyP.precio, anyP.price), 0),
      costPrice: this.toNum(this.first(anyP.precio_costo, anyP.costo, anyP.cost), 0),
      providerName: this.first(
        anyP.proveedor_nombre, anyP.provider_name,
        anyP.proveedor?.nombre, anyP.proveedor?.name
      ) as string | null,

      stockAvailable: Math.max(0, stockDisponible),
      stockReserved: Math.max(0, stockReservado),
      stockOnHand:   Math.max(0, stockOnHand),
      stockMin: this.toNum(this.first(anyP.stock_minimo, anyP.stockMin), 0),
      minAlertEnabled: this.truthy(this.first(anyP.alerta_minimo, anyP.min_alert_enabled, anyP.minAlert)),

      images: this.collectImages(anyP),
    };
  }

  // ===== Data =====
  async loadItem(id: string) {
    this.loading = true;
    this.error = undefined;
    try {
      let api: ProductApi | undefined;
      try { api = await this.productsSrv.getById(id); } catch {}
      if (!api || !api.id) {
        const list = await this.productsSrv.getAll();
        api = list.find((x: any) => String(x.id) === String(id)) as any;
      }
      if (!api) throw new Error('No encontrado');

      this.item = this.mapToUI(api);
      this.selectedIndex = 0;
    } catch (e: any) {
      this.error = e?.message || 'No se pudo cargar el detalle';
      this.item = undefined;
    } finally {
      this.loading = false;
    }
  }

  reload() { if (this.item?.id) this.loadItem(this.item.id); }

  // ===== Acciones UI =====
  selectImage(i: number) { this.selectedIndex = i; }
  triggerUpload() { this.fileInput?.nativeElement?.click(); }

  async handleUpload(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file || !this.item) return;
    try {
      const srv: any = this.productsSrv as any;
      if (typeof srv.uploadImage === 'function') {
        await srv.uploadImage(this.item.id, file);
      } else if (typeof srv.update === 'function') {
        const blobUrl = URL.createObjectURL(file);
        await srv.update(this.item.id, { image: blobUrl });
      }
      await this.presentToast('Imagen subida');
      await this.loadItem(this.item.id);
    } catch {
      await this.presentToast('No se pudo subir la imagen');
    } finally {
      (ev.target as HTMLInputElement).value = '';
    }
  }

  async viewHistory() {
    if (!this.item) return;
    // this.router.navigate(['/inventory', this.item.id, 'movements']);
    await this.presentToast('Historial (demo)');
  }

  async toggleMinAlert(ev: CustomEvent) {
    if (!this.item) return;
    const enabled = (ev as any).detail?.checked === true;
    try {
      const srv: any = this.productsSrv as any;
      if (typeof srv.updateInventory === 'function') {
        await srv.updateInventory(this.item.id, { alerta_minimo: enabled });
      } else if (typeof srv.update === 'function') {
        await srv.update(this.item.id, { alerta_minimo: enabled });
      }
      this.item.minAlertEnabled = enabled;
    } catch {
      await this.presentToast('No se pudo actualizar la alerta');
    }
  }

  async saveStockMin() {
    if (!this.item) return;
    try {
      const srv: any = this.productsSrv as any;
      if (typeof srv.updateInventory === 'function') {
        await srv.updateInventory(this.item.id, { stock_minimo: this.item.stockMin });
      } else if (typeof srv.update === 'function') {
        await srv.update(this.item.id, { stock_minimo: this.item.stockMin });
      }
      await this.presentToast('Stock mínimo actualizado');
    } catch {
      await this.presentToast('No se pudo actualizar');
    }
  }

  async addEntry() {
    if (!this.item) return;
    const alert = await this.alertCtrl.create({
      header: 'Agregar entrada',
      inputs: [{ name: 'qty', type: 'number', placeholder: 'Cantidad' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Agregar',
          handler: async ({ qty }) => {
            const n = this.toNum(qty, 0);
            if (n <= 0) return;
            try {
              const srv: any = this.productsSrv as any;
              if (typeof srv.addMovement === 'function') {
                await srv.addMovement(this.item!.id, { tipo: 'entrada', cantidad: n });
              } else if (typeof srv.update === 'function') {
                await srv.update(this.item!.id, { stock_actual: (this.item!.stockAvailable + n) });
              }
              await this.presentToast('Entrada registrada');
              await this.loadItem(this.item!.id);
            } catch {
              await this.presentToast('No se pudo registrar la entrada');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async addExit() {
    if (!this.item) return;
    const alert = await this.alertCtrl.create({
      header: 'Agregar salida',
      inputs: [{ name: 'qty', type: 'number', placeholder: 'Cantidad' }],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Registrar',
          handler: async ({ qty }) => {
            const n = this.toNum(qty, 0);
            if (n <= 0) return;
            try {
              const srv: any = this.productsSrv as any;
              if (typeof srv.addMovement === 'function') {
                await srv.addMovement(this.item!.id, { tipo: 'salida', cantidad: n });
              } else if (typeof srv.update === 'function') {
                await srv.update(this.item!.id, { stock_actual: (this.item!.stockAvailable - n) });
              }
              await this.presentToast('Salida registrada');
              await this.loadItem(this.item!.id);
            } catch {
              await this.presentToast('No se pudo registrar la salida');
            }
          },
        },
      ],
    });
    await alert.present();
  }

  async openMore() {
    const sheet = await this.actionSheet.create({
      header: 'Acciones',
      buttons: [
        { text: 'Compartir', icon: 'share-social-outline', handler: () => this.share() },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  async share() { await this.presentToast('Compartido (demo)'); }

  private async presentToast(message: string) {
    const t = await this.toast.create({ message, duration: 1500, position: 'bottom' });
    await t.present();
  }
}
