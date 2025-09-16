// src/app/pages/dashboard/products/components/product-management/product-management.component.ts
import { CommonModule } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { IonicModule, MenuController, ModalController } from "@ionic/angular";
import { RouterModule } from "@angular/router";
import {
  ProductService,
  ProductApi,
} from "src/app/core/services/bussiness/product.service";
import { ProductAddComponent } from "../product-add/product-add.component";

// 👇 Nuevos imports para detectar regreso a esta ruta
import { Router, NavigationEnd } from "@angular/router";
import { Subscription, filter } from "rxjs";

type Status = "Activo" | "Inactivo";

interface UIProduct {
  id: string;
  name: string;
  stock: number;
  status: Status;
  image?: string | null;
  categoryId?: string;
  providerId?: string;
}

@Component({
  selector: "app-product-management",
  standalone: true,
  templateUrl: "./product-management.component.html",
  styleUrls: ["./product-management.component.scss"],
  imports: [IonicModule, CommonModule, FormsModule, RouterModule],
})
export class ProductManagementComponent implements OnInit, OnDestroy {
  constructor(
    private menuCtrl: MenuController,
    private productsSrv: ProductService,
    private modalCtrl: ModalController,
    private router: Router // 👈 inyectamos Router
  ) {}

  // UI state
  loading = false;
  error?: string;

  // búsqueda / filtros
  query = "";
  activeFilter: string | null = null;

  // data
  products: UIProduct[] = [];
  filtered: UIProduct[] = [];

  // cache de portadas por id => url | null
  private coverCache = new Map<string, string | null>();

  // opciones
  statusOptions: Status[] = ["Activo", "Inactivo"];
  categoryOptions: { id: string; name: string }[] = [];
  providerOptions: { id: string; name: string }[] = [];

  // selección
  selectedStatuses = new Set<Status>();
  selectedCategories = new Set<string>();
  selectedProviders = new Set<string>();

  skeletons = Array.from({ length: 6 });

  // 👇 suscripciones compuestas
  private subs = new Subscription();

  // ⚠️ Ajusta según tu ruta real. Puedes dejarlo amplio con includes.
  private readonly LIST_URL_FRAGMENT = "/product-management";

  get activeFilterCount(): number {
    let n = 0;
    if (this.selectedStatuses.size) n++;
    if (this.selectedCategories.size) n++;
    if (this.selectedProviders.size) n++;
    return n;
  }

  ngOnInit(): void {
    // 1) Carga inicial
    this.loadProducts();

    // 2) Si cualquier producto cambia en otra pantalla, recarga
    this.subs.add(
      this.productsSrv.productChanged$.subscribe(() => this.loadProducts())
    );

    // 3) Si regresamos a esta ruta (back/forward o navegación), recarga
    this.subs.add(
      this.router.events
        .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
        .subscribe((e) => {
          const url = e.urlAfterRedirects || e.url || "";
          if (this.isListUrl(url)) {
            this.loadProducts();
          }
        })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  /**
   * Ionic lifecycle (si estás dentro de ion-router-outlet),
   * se dispara al entrar/volver a la vista.
   */
  ionViewWillEnter() {
    this.loadProducts();
  }

  // ====== Menu control ======
  openFilters() { this.menuCtrl.open("filters"); }
  closeFilters() { this.menuCtrl.close("filters"); }

  resetFilters() {
    this.selectedStatuses.clear();
    this.selectedCategories.clear();
    this.selectedProviders.clear();
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
      const apiList = await this.productsSrv.getAll(); // ProductApi[]
      this.products = apiList.map(this.toUI);

      // hidratar portadas (usa idunico cuando exista)
      await this.hydrateCovers(this.products, apiList);

      this.applyFilter();
    } catch (e: any) {
      this.error = e?.message || "No se pudo cargar productos";
    } finally {
      this.loading = false;
    }
  }

  private toUI = (p: ProductApi): UIProduct => ({
    id: p.id,
    name: p.nombre,
    stock: Number(p.stock_actual ?? 0),
    status: (p.estado as Status) || "Activo",
    image: null, // se completa en hydrateCovers
    categoryId: p.categoria_id,
    providerId: p.proveedor_id,
  });

  /** Descarga y asigna la portada de cada producto (con caché). */
  private async hydrateCovers(uiList: UIProduct[], apiList: ProductApi[]) {
    const byId = new Map(apiList.map(a => [a.id, a]));
    const tasks = uiList.map(async (row) => {
      if (this.coverCache.has(row.id)) {
        row.image = this.coverCache.get(row.id)!;
        return;
      }
      const api = byId.get(row.id);
      let url: string | null = null;
      try {
        // intenta endpoint que prueba id + idunico
        if (api?.idunico) {
          url = await this.productsSrv.getCoverUrl({ id: row.id, idunico: api.idunico });
        } else {
          url = await this.productsSrv.getCoverUrl(row.id);
        }
      } catch { url = null; }
      this.coverCache.set(row.id, url);
      row.image = url;
    });

    await Promise.allSettled(tasks);
  }

  async reload(ev?: CustomEvent) {
    await this.loadProducts(); // vuelve a pedir datos e imágenes
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
          (p.categoryId || "").toLowerCase().includes(q) ||
          (p.providerId || "").toLowerCase().includes(q)
      );
    }

    if (this.selectedStatuses.size) {
      out = out.filter((p) => this.selectedStatuses.has(p.status));
    }
    if (this.selectedCategories.size) {
      out = out.filter(
        (p) => p.categoryId && this.selectedCategories.has(p.categoryId)
      );
    }
    if (this.selectedProviders.size) {
      out = out.filter(
        (p) => p.providerId && this.selectedProviders.has(p.providerId)
      );
    }

    this.filtered = out;
    this.activeFilter = this.buildActiveFilterLabel();
  }

  private buildActiveFilterLabel(): string | null {
    const parts: string[] = [];
    if (this.selectedStatuses.size)
      parts.push(Array.from(this.selectedStatuses).join(", "));
    if (this.selectedCategories.size) {
      const names = this.categoryOptions
        .filter((c) => this.selectedCategories.has(c.id))
        .map((c) => c.name);
      if (names.length) parts.push(names.join(", "));
    }
    if (this.selectedProviders.size) {
      const names = this.providerOptions
        .filter((p) => this.selectedProviders.has(p.id))
        .map((p) => p.name);
      if (names.length) parts.push(names.join(", "));
    }
    return parts.length ? parts.join(" • ") : null;
  }

  toggleStatus(s: Status, checked: boolean) {
    checked ? this.selectedStatuses.add(s) : this.selectedStatuses.delete(s);
  }
  toggleCategory(id: string, checked: boolean) {
    checked
      ? this.selectedCategories.add(id)
      : this.selectedCategories.delete(id);
  }
  toggleProvider(id: string, checked: boolean) {
    checked
      ? this.selectedProviders.add(id)
      : this.selectedProviders.delete(id);
  }

  clearSearch() {
    this.query = "";
    this.applyFilter();
  }
  clearFilter() {
    this.resetFilters();
  }

  // ====== Helpers UI ======
  trackById(_: number, p: UIProduct) { return p.id; }

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
      // limpia caché para ver la imagen del nuevo
      this.coverCache.clear();
      await this.loadProducts();
    }
  }

  // ====== Util ======
  /** Determina si la URL actual corresponde a esta vista de listado. */
  private isListUrl(url: string): boolean {
    // Lo hacemos tolerante por si hay prefijos (/dashboard, query params, etc.)
    return url.includes(this.LIST_URL_FRAGMENT);
  }
}
