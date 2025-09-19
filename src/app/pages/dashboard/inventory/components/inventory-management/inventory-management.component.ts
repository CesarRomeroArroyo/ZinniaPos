import { CommonModule } from "@angular/common";
import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule, MenuController, ModalController } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import {
  ProductService,
  ProductApi,
} from "src/app/core/services/bussiness/product.service";
import { ProductAddComponent } from "src/app/pages/dashboard/products/components/product-add/product-add.component";

type StockFilter = "with" | "low" | "out";

interface UIProduct {
  id: string;
  name: string;
  stock: number;
  image?: string | null;
  idunico?: string | null; // 👈 para construir la URL de imagen
  categoryId?: string | null;
  categoryName?: string | null;
  price?: number | null; // para “Valor de inventario”
  lastMoveAgo?: string | null; // “Últ. mov”
  lowStock: boolean;
}

@Component({
  selector: "app-inventory-management",
  standalone: true,
  templateUrl: "./inventory-management.component.html",
  styleUrls: ["./inventory-management.component.scss"],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class InventoryManagementComponent implements OnInit, OnDestroy {
  constructor(
    private menuCtrl: MenuController,
    private productsSrv: ProductService,
    private modalCtrl: ModalController
  ) {}

  // UI state
  loading = false;
  error?: string;

  // búsqueda / filtros
  query = "";
  activeFilter: string | null = null;

  // opciones
  categoryOptions: { id: string; name: string }[] = [];

  // data
  products: UIProduct[] = [];
  filtered: UIProduct[] = [];

  // selección filtros
  stockStatus = new Set<StockFilter>(); // with/low/out
  selectedCategories = new Set<string>();

  // métricas
  inventoryValue = 0;
  totalUnits = 0;
  lowCount = 0;
  outCount = 0;

  skeletons = Array.from({ length: 6 });
  lowThreshold = 5; // <=5 marca “Stock bajo”

  private destroyed = false;
  ngOnDestroy(): void {
    this.destroyed = true;
  }

  get activeFilterCount(): number {
    let n = 0;
    if (this.stockStatus.size) n++;
    if (this.selectedCategories.size) n++;
    return n;
  }

  ngOnInit(): void {
    this.loadProducts();
  }

  // ====== Menu control ======
  openFilters() {
    this.menuCtrl.open("filters");
  }
  closeFilters() {
    this.menuCtrl.close("filters");
  }
  resetFilters() {
    this.stockStatus.clear();
    this.selectedCategories.clear();
    this.applyFilter();
  }
  applyAndClose() {
    this.applyFilter();
    this.closeFilters();
  }

  // ====== Data ======
  async loadProducts() {
    this.loading = true;
    this.error = undefined;
    try {
      const list = await this.productsSrv.getAll(); // ProductApi[]
      this.products = list.map(this.toUI);
      this.applyFilter(); // pinta rápido sin imagen
      this.hydrateImages(this.products); // 👈 hidrata imágenes en segundo plano
      this.recomputeMetrics(this.products);
    } catch (e: any) {
      this.error = e?.message || "No se pudo cargar productos";
    } finally {
      this.loading = false;
    }
  }

  private toUI = (p: ProductApi): UIProduct => {
    const stock = Number(p.stock_actual ?? 0);
    const price = Number((p as any).precio ?? (p as any).precio_venta ?? 0);
    const lastMoveAgo = (p as any).updated_at
      ? this.timeAgo((p as any).updated_at)
      : "Hace 3 días";

    return {
      id: p.id,
      idunico: (p as any).idunico ?? null, // 👈 guardamos idunico si viene
      name: p.nombre,
      stock,
      image: null, // se completa en hydrateImages
      categoryId: p.categoria_id ?? null,
      categoryName: (p as any).categoria_nombre ?? null,
      price: isNaN(price) ? 0 : price,
      lastMoveAgo,
      lowStock: stock > 0 && stock <= this.lowThreshold,
    };
  };

  /** Hidrata `image` para cada item usando /imagenes o portada */
  private async hydrateImages(items: UIProduct[]) {
    await Promise.all(
      items.map(async (p) => {
        try {
          const imgs = await this.productsSrv.getImages({
            id: p.id,
            idunico: p.idunico ?? undefined,
          });
          const first: string | null = imgs && imgs.length ? imgs[0] : null;

          const cover: string | null = first
            ? null
            : await this.productsSrv.getCoverUrl({
                id: p.id,
                idunico: p.idunico ?? undefined,
              });

          const url: string | null = first ?? cover ?? null;

          if (url && !this.destroyed) {
            p.image = url; // image es string | null, así que OK
          }
        } catch {
          // dejamos el placeholder
        }
      })
    );

    if (!this.destroyed) this.applyFilter();
  }

  private recomputeMetrics(list: UIProduct[]) {
    this.inventoryValue = list.reduce(
      (acc, p) => acc + (p.price || 0) * (p.stock || 0),
      0
    );
    this.totalUnits = list.reduce((acc, p) => acc + (p.stock || 0), 0);
    this.lowCount = list.filter((p) => p.lowStock).length;
    this.outCount = list.filter((p) => p.stock === 0).length;
  }

  reload(ev?: CustomEvent) {
    this.applyFilter();
    (ev?.target as HTMLIonRefresherElement)?.complete?.();
  }

  // ====== Filtros / búsqueda ======
  applyFilter() {
    const q = this.query.trim().toLowerCase();
    let out = [...this.products];

    if (q) {
      out = out.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.categoryName || "").toLowerCase().includes(q)
      );
    }

    if (this.stockStatus.size) {
      out = out.filter((p) => {
        const s: StockFilter =
          p.stock === 0 ? "out" : p.lowStock ? "low" : "with";
        return this.stockStatus.has(s);
      });
    }

    if (this.selectedCategories.size) {
      out = out.filter(
        (p) => p.categoryId && this.selectedCategories.has(p.categoryId)
      );
    }

    this.filtered = out;
    this.recomputeMetrics(out);
    this.activeFilter = this.buildActiveFilterLabel();
  }

  private buildActiveFilterLabel(): string | null {
    const parts: string[] = [];
    if (this.stockStatus.size) {
      const map: Record<StockFilter, string> = {
        with: "Con stock",
        low: "Stock bajo",
        out: "Agotado",
      };
      parts.push(
        Array.from(this.stockStatus)
          .map((s) => map[s])
          .join(", ")
      );
    }
    if (this.selectedCategories.size) {
      const names = this.categoryOptions
        .filter((c) => this.selectedCategories.has(c.id))
        .map((c) => c.name);
      if (names.length) parts.push(names.join(", "));
    }
    return parts.length ? parts.join(" • ") : null;
  }

  toggleStock(s: StockFilter, checked: boolean) {
    checked ? this.stockStatus.add(s) : this.stockStatus.delete(s);
  }
  toggleCategory(id: string, checked: boolean) {
    checked
      ? this.selectedCategories.add(id)
      : this.selectedCategories.delete(id);
  }

  clearSearch() {
    this.query = "";
    this.applyFilter();
  }
  clearFilter() {
    this.resetFilters();
  }
  trackById(_: number, p: UIProduct) {
    return p.id;
  }

  async onAdd() {
    const modal = await this.modalCtrl.create({
      component: ProductAddComponent,
      cssClass: "option-select-modal",
      breakpoints: [0, 1],
      initialBreakpoint: 1,
    });
    await modal.present();
    const { data } = await modal.onDidDismiss();
    if (data?.completed) {
      await this.loadProducts();
    }
  }

  private timeAgo(dateIso: string): string {
    const then = new Date(dateIso).getTime();
    const now = Date.now();
    const diff = Math.max(0, now - then);
    const d = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (d >= 1) return `Hace ${d} día${d > 1 ? "s" : ""}`;
    const h = Math.floor(diff / (1000 * 60 * 60));
    if (h >= 1) return `Hace ${h} h`;
    const m = Math.floor(diff / (1000 * 60));
    return `Hace ${m} min`;
  }
}
