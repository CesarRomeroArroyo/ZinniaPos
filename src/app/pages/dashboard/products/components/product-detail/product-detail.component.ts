import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { IonicModule, AlertController, ActionSheetController, ToastController } from '@ionic/angular';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { Subscription } from 'rxjs';
import { ProductService, ProductApi } from 'src/app/core/services/bussiness/product.service';

type Status = 'Activo' | 'Inactivo';

interface UIProductDetail {
  id: string;
  name: string;
  status: Status;
  description?: string | null;
  salePrice: number;
  costPrice: number;
  providerName?: string | null;
  categoryName?: string | null;
  stockActual: number;
  stockMin: number;
  images: string[];
}

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [IonicModule, CommonModule, RouterModule],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
})
export class ProductDetailComponent implements OnInit, OnDestroy {

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
  product?: UIProductDetail;

  selectedIndex = 0;
  get heroImage(): string | null {
    return this.product?.images?.[this.selectedIndex] ?? null;
  }

  private sub?: Subscription;

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((pm) => {
      const id = pm.get('id');
      if (!id) {
        this.error = 'Falta el id de producto.';
        this.loading = false;
        return;
      }
      this.loadProduct(id);
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  // ========= Utilidades de mapeo =========
  private toNumber(v: any): number {
    if (v === null || v === undefined || v === '') return 0;
    if (typeof v === 'number') return isFinite(v) ? v : 0;

    // normaliza "1.234,56" o "1,234.56" y similares
    const s = String(v).trim();
    const hasComma = s.includes(',');
    const hasDot = s.includes('.');

    let normalized = s;
    if (hasComma && hasDot) {
      // asume que la coma es decimal si está a la derecha
      normalized = s.replace(/\./g, '').replace(',', '.');
    } else if (hasComma) {
      normalized = s.replace(',', '.');
    }
    const n = parseFloat(normalized);
    return isFinite(n) ? n : 0;
  }

  private statusToText(v: any): Status {
    // soporta boolean/numérico/string
    if (v === true || v === 1 || String(v).toLowerCase() === '1' || String(v).toLowerCase() === 'true' || String(v).toLowerCase() === 'activo' || String(v).toLowerCase() === 'active') {
      return 'Activo';
    }
    if (v === false || v === 0 || String(v).toLowerCase() === '0' || String(v).toLowerCase() === 'false' || String(v).toLowerCase() === 'inactivo' || String(v).toLowerCase() === 'inactive') {
      return 'Inactivo';
    }
    return 'Activo';
  }

  private firstNonEmpty<T = any>(...vals: T[]): T | null {
    for (const v of vals) {
      if (v !== undefined && v !== null && v !== '') return v;
    }
    return null;
  }

  private collectImages(p: any): string[] {
    const arrCandidate = this.firstNonEmpty<any[]>(
      Array.isArray(p?.imagenes) ? p.imagenes : null,
      Array.isArray(p?.images) ? p.images : null,
      Array.isArray(p?.fotos) ? p.fotos : null,
    ) || [];

    const single = this.firstNonEmpty<string>(
      p?.imagen, p?.image, p?.url_imagen, p?.urlImagen
    );

    const out: string[] = [];
    if (arrCandidate?.length) out.push(...arrCandidate.filter(Boolean));
    if (single) out.push(single);
    return out;
  }

  private mapToUI(p: ProductApi): UIProductDetail {
    const anyP: any = p;

    const name = this.firstNonEmpty(
      anyP.nombre, anyP.name, anyP.titulo, anyP.title, 'Producto'
    ) as string;

    const description = this.firstNonEmpty(
      anyP.descripcion, anyP.description, anyP.detalle, anyP.observaciones
    ) as string | null;

    const salePrice = this.toNumber(
      this.firstNonEmpty(anyP.precio_venta, anyP.precioVenta, anyP.precio, anyP.price, anyP.pvp, 0)
    );
    const costPrice = this.toNumber(
      this.firstNonEmpty(anyP.precio_costo, anyP.precioCosto, anyP.costo, anyP.cost, 0)
    );

    const stockActual = this.toNumber(
      this.firstNonEmpty(anyP.stock_actual, anyP.stock, anyP.existencias, anyP.cantidad, 0)
    );
    const stockMin = this.toNumber(
      this.firstNonEmpty(anyP.stock_minimo, anyP.stockMin, anyP.stock_min, 0)
    );

    const providerName = this.firstNonEmpty(
      anyP.proveedor_nombre, anyP.provider_name,
      anyP.proveedor?.nombre, anyP.proveedor?.name,
      anyP.provider?.nombre, anyP.provider?.name
    ) as string | null;

    const categoryName = this.firstNonEmpty(
      anyP.categoria_nombre, anyP.category_name,
      anyP.categoria?.nombre, anyP.categoria?.name,
      anyP.category?.nombre, anyP.category?.name
    ) as string | null;

    return {
      id: String(anyP.id ?? anyP._id ?? anyP.codigo ?? ''),
      name,
      status: this.statusToText(this.firstNonEmpty(anyP.estado, anyP.status, anyP.activo, true)),
      description,
      salePrice,
      costPrice,
      providerName,
      categoryName,
      stockActual,
      stockMin,
      images: this.collectImages(anyP),
    };
  }

  // ========= Carga de datos =========
  async loadProduct(id: string) {
    this.loading = true;
    this.error = undefined;

    try {
      // 1) intenta por getById
      let apiProduct: ProductApi | undefined;

      try {
        apiProduct = await this.productsSrv.getById(id);
      } catch {
        // continúa al fallback
      }

      // 2) fallback: busca en la lista si el getById no retornó nada útil
      if (!apiProduct || !apiProduct.id) {
        const list = await this.productsSrv.getAll();
        apiProduct = list.find((x: any) => String(x.id) === String(id)) as any;
      }

      if (!apiProduct) {
        throw new Error('Producto no encontrado');
      }

      this.product = this.mapToUI(apiProduct);
      this.selectedIndex = 0;
    } catch (e: any) {
      this.error = e?.message || 'No se pudo cargar el producto';
      this.product = undefined;
    } finally {
      this.loading = false;
    }
  }

  reload() {
    if (this.product?.id) this.loadProduct(this.product.id);
  }

  // ========= Acciones UI =========
  selectImage(i: number) { this.selectedIndex = i; }
  triggerUpload() { this.fileInput?.nativeElement?.click(); }

  async handleUpload(ev: Event) {
    const file = (ev.target as HTMLInputElement).files?.[0];
    if (!file || !this.product) return;

    try {
      const srv: any = this.productsSrv as any;
      if (typeof srv.uploadImage === 'function') {
        await srv.uploadImage(this.product.id, file);
      } else if (typeof srv.update === 'function') {
        // Si no hay endpoint de subida, guarda un URL temporal (demo)
        const blobUrl = URL.createObjectURL(file);
        await srv.update(this.product.id, { image: blobUrl });
      }
      await this.presentToast('Imagen subida');
      await this.loadProduct(this.product.id);
    } catch {
      await this.presentToast('No se pudo subir la imagen');
    } finally {
      (ev.target as HTMLInputElement).value = '';
    }
  }

  async editInventory() {
    if (!this.product) return;
    const alert = await this.alertCtrl.create({
      header: 'Editar inventario',
      inputs: [
        { name: 'stockActual', type: 'number', value: String(this.product.stockActual), placeholder: 'Stock actual' },
        { name: 'stockMin', type: 'number', value: String(this.product.stockMin), placeholder: 'Stock mínimo' },
      ],
      buttons: [
        { text: 'Cancelar', role: 'cancel' },
        {
          text: 'Guardar',
          handler: async (data) => {
            try {
              const payload = {
                stock_actual: this.toNumber(data.stockActual),
                stock_minimo: this.toNumber(data.stockMin),
              };
              const srv: any = this.productsSrv as any;
              if (typeof srv.updateInventory === 'function') {
                await srv.updateInventory(this.product!.id, payload);
              } else if (typeof srv.update === 'function') {
                await srv.update(this.product!.id, payload);
              }
              await this.presentToast('Inventario actualizado');
              await this.loadProduct(this.product!.id);
            } catch {
              await this.presentToast('No se pudo actualizar');
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
        { text: 'Editar', icon: 'create-outline', handler: () => this.goToEdit() },
        { text: 'Compartir', icon: 'share-social-outline', handler: () => this.share() },
        { text: 'Cancelar', role: 'cancel' },
      ],
    });
    await sheet.present();
  }

  goToEdit() {
    if (this.product) {
      this.router.navigate(['/products', 'edit', this.product.id]);
    }
  }

  async share() {
    await this.presentToast('Compartido (demo)');
  }

  private async presentToast(message: string) {
    const t = await this.toast.create({ message, duration: 1600, position: 'bottom' });
    await t.present();
  }
}
