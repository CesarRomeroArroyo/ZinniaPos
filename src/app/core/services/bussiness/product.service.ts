import { Injectable } from "@angular/core";
import { Observable, Subject, firstValueFrom, map } from "rxjs";
import { ApiService } from "src/app/data/api.service";
import { IProduct } from "src/app/core/interfaces/bussiness/product.interface";
import { ITax } from "src/app/core/interfaces/bussiness/tax.interface";

/** Modelo normalizado desde el backend */
export interface ProductApi {
  id: string;
  nombre: string;
  categoria_id: string;

  /** opcionales */
  descripcion?: string;
  estado?: string; // 'Activo' | 'Inactivo'
  proveedor_id?: string;
  impuesto?: number; // p. ej. 18 -> 18%
  idunico?: string; // endpoints de imágenes usan esto

  /** precios y stock */
  stock_actual?: number; // normalizamos desde stock | stock_actual
  precio?: number;
  precio_venta?: number; // pvp | precio | precio_venta
  precio_costo?: number; // costo | precio_costo
}

export interface CreateProductDto {
  nombre: string;
  precio: number;
  categoria_id: string;
  descripcion?: string;
  stock_actual?: number;
  proveedor_id?: string;
  impuesto?: number;
}
export type UpdateProductDto = Partial<CreateProductDto>;

export interface CreateProductResult {
  ok: boolean;
  id?: string;
  raw?: any;
}

/** Crear producto (x-www-form-urlencoded) con campos completos */
export interface CreateProductFullDto {
  nombre: string;
  descripcion?: string;
  precio_venta: number;
  precio_costo: number;
  stock: number;
  categoria_id: string | number;
  proveedor_id?: string | number;
  impuesto?: number;
  idunico?: string;
}
export interface CreateProductFullResult {
  ok: boolean;
  id?: string | number;
  idunico?: string;
  raw?: any;
}

type BackendErrors = Record<string, string | string[]>;

@Injectable({ providedIn: "root" })
export class ProductService {
  private static readonly BASE = "/productos";
  private static readonly BY_ID = (id: string) =>
    `/productos/${encodeURIComponent(id)}`;
  private static readonly SEARCH = (q: string) =>
    `/productosBuscar/${encodeURIComponent(q)}/`;
  // Fallback legacy; preferimos PUT /productos/:id
  private static readonly STOCK = (productoId: string) =>
    `/inventario/stock/${encodeURIComponent(productoId)}`;

  constructor(private api: ApiService) {}

  /** 🔔 Se emite cada vez que un producto cambia (crear/actualizar/eliminar/stock/imagenes). */
  public readonly productChanged$ = new Subject<{
    id: string;
    type:
      | "created"
      | "updated"
      | "deleted"
      | "stock_updated"
      | "image_uploaded"
      | "image_deleted"
      | "generic";
    payload?: any;
  }>();

  /** Permite notificar manualmente un cambio de producto */
  public notifyProductChanged(
    id: string,
    type:
      | "created"
      | "updated"
      | "deleted"
      | "stock_updated"
      | "image_uploaded"
      | "image_deleted"
      | "generic" = "generic",
    payload?: any
  ) {
    this.productChanged$.next({ id, type, payload });
  }

  // ===== Helpers
  private toNumber(v: any): number {
    if (v === null || v === undefined || v === "") return 0;
    if (typeof v === "number") return isFinite(v) ? v : 0;
    const s = String(v).trim();
    let nStr = s;
    const hasComma = s.includes(","),
      hasDot = s.includes(".");
    if (hasComma && hasDot) nStr = s.replace(/\./g, "").replace(",", ".");
    else if (hasComma) nStr = s.replace(",", ".");
    const n = parseFloat(nStr);
    return isFinite(n) ? n : 0;
  }
  private isHttpUrl(s?: string): boolean {
    return !!s && /^https?:\/\//i.test(s);
  }

  private firstError(err: any): string | undefined {
    if (typeof err?.error?.message === "string" && err.error.message.trim())
      return err.error.message.trim();
    const errors = (err?.error?.errors ?? err?.errors) as
      | BackendErrors
      | undefined;
    if (errors && typeof errors === "object") {
      const v = Object.values(errors)[0];
      if (Array.isArray(v)) return String(v[0] ?? "").trim() || undefined;
      if (typeof v === "string") return v.trim() || undefined;
    }
    if (typeof err?.message === "string" && err.message.trim())
      return err.message.trim();
    return undefined;
  }

  private normalize = (raw: any): ProductApi => ({
    id: String(raw?.id ?? ""),
    nombre: String(raw?.nombre ?? raw?.name ?? ""),
    categoria_id: String(
      raw?.categoria_id ?? raw?.category_id ?? raw?.categoriaId ?? ""
    ),
    idunico: raw?.idunico != null ? String(raw.idunico) : undefined,

    descripcion: raw?.descripcion ?? raw?.description ?? undefined,
    estado: raw?.estado ?? raw?.status ?? undefined,
    proveedor_id:
      raw?.proveedor_id != null
        ? String(raw.proveedor_id)
        : raw?.supplier_id != null
        ? String(raw.supplier_id)
        : undefined,
    impuesto: raw?.impuesto != null ? this.toNumber(raw.impuesto) : undefined,

    stock_actual:
      raw?.stock_actual != null
        ? this.toNumber(raw.stock_actual)
        : raw?.stock != null
        ? this.toNumber(raw.stock)
        : undefined,

    precio:
      raw?.precio != null
        ? this.toNumber(raw.precio)
        : raw?.price != null
        ? this.toNumber(raw.price)
        : undefined,

    precio_venta: (() => {
      if (raw?.precio_venta != null) return this.toNumber(raw.precio_venta);
      if (raw?.pvp != null) return this.toNumber(raw.pvp);
      if (raw?.precio != null) return this.toNumber(raw.precio);
      return undefined;
    })(),

    precio_costo: (() => {
      if (raw?.precio_costo != null) return this.toNumber(raw.precio_costo);
      if (raw?.costo != null) return this.toNumber(raw.costo);
      return undefined;
    })(),
  });

  /** ProductApi → IProduct (compat) */
  public toIProduct = (p: ProductApi): IProduct => ({
    id: p.id as any,
    name: p.nombre,
    description: p.descripcion ?? "",
    costPrice: this.toNumber(p.precio_costo ?? 0),
    salePrice: this.toNumber(p.precio_venta ?? p.precio ?? 0),
    stock: this.toNumber(p.stock_actual ?? 0),
    category: p.categoria_id
      ? ({ id: p.categoria_id, name: "" } as any)
      : (undefined as any),
    supplier: p.proveedor_id
      ? ({ id: p.proveedor_id, name: "" } as any)
      : (undefined as any),
    tax: ((): ITax | undefined => {
      if (p.impuesto == null) return undefined;
      return {
        id: "default-tax",
        name: "Impuesto",
        value: this.toNumber(p.impuesto),
        type: "PERCENTAGE",
      } as any;
    })(),
    images: [],
    status: (p.estado as any) ?? "Activo",
  });

  // ===== Endpoints
  getAll$(params?: {
    where?: string | number;
    categoria_id?: string;
    proveedor_id?: string;
  }): Observable<ProductApi[]> {
    const query: Record<string, any> = { where: 1, ...(params ?? {}) };
    return this.api.get<any>(ProductService.BASE, query).pipe(
      map((data: any) => {
        const arr: unknown[] = Array.isArray(data) ? data : data?.data ?? [];
        return (arr as any[]).map(this.normalize);
      })
    );
  }
  async getAll(params?: {
    where?: string | number;
    categoria_id?: string;
    proveedor_id?: string;
  }): Promise<ProductApi[]> {
    return await firstValueFrom(this.getAll$(params));
  }

  async getById(id: string): Promise<ProductApi> {
    try {
      const data = await firstValueFrom(
        this.api.get<any>(ProductService.BY_ID(id))
      );
      return this.normalize(data);
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? "No se pudo obtener el producto");
    }
  }

  async search(search: string): Promise<ProductApi[]> {
    try {
      const data = await firstValueFrom(
        this.api.get<any>(ProductService.SEARCH(search))
      );
      const arr: unknown[] = Array.isArray(data) ? data : data?.data ?? [];
      return (arr as any[]).map(this.normalize);
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? "No se pudo buscar productos");
    }
  }

  async create(input: CreateProductDto): Promise<CreateProductResult> {
    try {
      const resp = await firstValueFrom(
        this.api.post<any>(ProductService.BASE, input)
      );
      const ok = resp?.success === true || resp?.ok === true || true;
      const rawId = resp?.id;
      const id = rawId != null && rawId !== true ? String(rawId) : undefined;

      if (id) this.notifyProductChanged(id, "created", { input, resp });

      return { ok, id, raw: resp };
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? "No se pudo crear el producto");
    }
  }

  async createProduct(
    input: CreateProductFullDto
  ): Promise<CreateProductFullResult> {
    const form: Record<string, any> = {
      nombre: input.nombre,
      descripcion: input.descripcion ?? "",
      precio_venta: String(input.precio_venta),
      precio_costo: String(input.precio_costo),
      stock: String(input.stock),
      categoria_id: String(input.categoria_id),
      ...(input.proveedor_id
        ? { proveedor_id: String(input.proveedor_id) }
        : {}),
      ...(input.impuesto != null ? { impuesto: String(input.impuesto) } : {}),
      ...(input.idunico ? { idunico: String(input.idunico) } : {}),
    };
    try {
      const resp: any = await firstValueFrom(
        this.api.postUrlEncoded<any>(ProductService.BASE, form)
      );
      const ok = resp?.success === true || resp?.ok === true || true;
      const id = resp?.id ?? resp?.data?.id;
      const idunico =
        resp?.idunico ?? resp?.data?.idunico ?? resp?.producto?.idunico;

      if (id != null) this.notifyProductChanged(String(id), "created", { form, resp });

      return { ok, id, idunico, raw: resp };
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? "No se pudo crear el producto");
    }
  }

  // ProductService.update
  async update(id: string, changes: Record<string, any>): Promise<boolean> {
    const url = ProductService.BY_ID(String(id));
    console.log("[ProductService.update] url=", url, "payload=", changes);
    try {
      await firstValueFrom(this.api.put<any>(url, { ...changes }));
      console.log("[ProductService.update] OK");
      // 🔔 notificar actualización
      this.notifyProductChanged(String(id), "updated", { changes });
      return true;
    } catch (e: any) {
      console.error("[ProductService.update] ERROR", e);
      const msg = this.firstError(e) ?? "No se pudo actualizar el producto";
      throw new Error(msg);
    }
  }

  async remove(id: string): Promise<boolean> {
    try {
      await firstValueFrom(this.api.delete<any>(ProductService.BY_ID(id)));
      // 🔔 notificar eliminación
      this.notifyProductChanged(String(id), "deleted");
      return true;
    } catch (e: any) {
      throw new Error(this.firstError(e) ?? "No se pudo eliminar el producto");
    }
  }

  // ===== Imágenes
  async getCoverUrl(
    arg: { id?: string; idunico?: string } | string
  ): Promise<string | null> {
    const id = typeof arg === "string" ? arg : arg?.id;
    const idunico = typeof arg === "string" ? undefined : arg?.idunico;

    const bases: string[] = [];
    if (id) bases.push(`/productos/${encodeURIComponent(id)}/imagenes`);
    if (idunico)
      bases.push(`/productos/${encodeURIComponent(idunico)}/imagenes`);

    let usedBase: string | null = null;
    let data: any;

    for (const b of bases) {
      try {
        data = await firstValueFrom(this.api.get<any>(b));
        usedBase = b;
        break;
      } catch {}
    }
    if (!usedBase) return null;

    const list: any[] = Array.isArray(data)
      ? data
      : Array.isArray(data?.imagenes)
      ? data.imagenes
      : Array.isArray(data?.images)
      ? data.images
      : Array.isArray(data?.files)
      ? data.files
      : [];

    const coverCandidate =
      data?.portada ?? data?.cover ?? data?.imagen_portada_url ?? null;
    let url = this.pickImageUrl(coverCandidate, usedBase);
    if (!url && list.length) url = this.pickImageUrl(list[0], usedBase);
    return url ?? null;
  }

  async getImages(
    arg: { id?: string; idunico?: string } | string
  ): Promise<string[]> {
    const id = typeof arg === "string" ? arg : arg?.id;
    const idunico = typeof arg === "string" ? undefined : arg?.idunico;

    const bases: string[] = [];
    if (id) bases.push(`/productos/${encodeURIComponent(id)}/imagenes`);
    if (idunico)
      bases.push(`/productos/${encodeURIComponent(idunico)}/imagenes`);

    for (const base of bases) {
      try {
        const data = await firstValueFrom(this.api.get<any>(base));
        const rawList: any[] = Array.isArray(data)
          ? data
          : Array.isArray(data?.imagenes)
          ? data.imagenes
          : Array.isArray(data?.images)
          ? data.images
          : Array.isArray(data?.files)
          ? data.files
          : [];
        if (!rawList.length) continue;

        const toUrl = (x: any) => {
          const s =
            typeof x === "string"
              ? x
              : x?.url ?? x?.src ?? x?.file ?? x?.filename ?? "";
          return this.ensureUrlFromBase(String(s), base);
        };
        return rawList.map(toUrl).filter(Boolean);
      } catch {}
    }

    const cover = await this.getCoverUrl({ id, idunico });
    return cover ? [cover] : [];
  }

  /** Eliminar una imagen SOLO con DELETE: /productos/:key/imagenes/:filename */
  async deleteImage(
    arg: { id?: string; idunico?: string } | string,
    fileOrUrl: string
  ): Promise<boolean> {
    const id = typeof arg === "string" ? arg : arg?.id;
    const idunico = typeof arg === "string" ? undefined : arg?.idunico;
    const key = idunico || id;
    if (!key) throw new Error("Falta id o idunico para eliminar imagen");

    // filename limpio (sin querystring)
    const filename = this.extractFilename(fileOrUrl);
    const base = `/productos/${encodeURIComponent(key)}/imagenes`;
    const url = `${base}/${encodeURIComponent(filename)}`;

    try {
      await firstValueFrom(this.api.delete<any>(url));
      // 🔔 notificar imagen eliminada
      this.notifyProductChanged(String(id ?? idunico ?? ""), "image_deleted", {
        filename,
      });
      return true;
    } catch (e: any) {
      // Propaga el error “real” del backend
      const msg = this.firstError(e) ?? "No se pudo eliminar la imagen";
      throw new Error(msg);
    }
  }

  private pickImageUrl(entry: any, basePath: string): string | null {
    if (!entry) return null;
    if (typeof entry === "object") {
      const cand =
        entry.url ??
        entry.href ??
        entry.src ??
        entry.path ??
        entry.file ??
        entry.filename;
      if (cand) return this.ensureUrlFromBase(String(cand), basePath);
    }
    if (typeof entry === "string")
      return this.ensureUrlFromBase(entry, basePath);
    return null;
  }
  private ensureUrlFromBase(val: string, basePath: string): string {
    const s = String(val).trim();
    if (this.isHttpUrl(s)) return s;
    const base = basePath.endsWith("/") ? basePath : basePath + "/";
    return `${base}${s}`;
  }
  private extractFilename(url: string): string {
    try {
      return String(url).split("?")[0].split("/").pop() || String(url);
    } catch {
      return String(url);
    }
  }

  // ===== Inventario (solo PUT)
  async setStock(productoId: string | number, stock: number): Promise<boolean> {
    const id = String(productoId);
    const n = this.toNumber(stock);

    const urlById = ProductService.BY_ID(id);
    const urlLegacy = ProductService.STOCK(id); // /inventario/stock/:id

    // algunos backends devuelven HTML aunque actualicen: toléralo si es 2xx
    const okDespiteParse = (e: any) => {
      const status = Number(e?.status ?? 0);
      const raw = typeof e?.error === "string" ? e.error : e?.error?.text;
      return (
        (status >= 200 && status < 300) ||
        /parsing|Unexpected token|<!DOCTYPE/i.test(
          String(e?.message ?? raw ?? "")
        )
      );
    };

    // intentos SOLO con PUT (nunca POST)
    try {
      await firstValueFrom(this.api.put<any>(urlById, { stock: n }));
      // 🔔 notificar stock actualizado
      this.notifyProductChanged(id, "stock_updated", { stock: n });
      return true;
    } catch (e1: any) {
      if (okDespiteParse(e1)) {
        this.notifyProductChanged(id, "stock_updated", { stock: n });
        return true;
      }
      try {
        await firstValueFrom(this.api.put<any>(urlById, { stock_actual: n }));
        this.notifyProductChanged(id, "stock_updated", { stock: n });
        return true;
      } catch (e2: any) {
        if (okDespiteParse(e2)) {
          this.notifyProductChanged(id, "stock_updated", { stock: n });
          return true;
        }
        try {
          await firstValueFrom(this.api.put<any>(urlLegacy, { stock: n }));
          this.notifyProductChanged(id, "stock_updated", { stock: n });
          return true;
        } catch (e3: any) {
          if (okDespiteParse(e3)) {
            this.notifyProductChanged(id, "stock_updated", { stock: n });
            return true;
          }
          try {
            await firstValueFrom(
              this.api.put<any>(urlLegacy, { stock_actual: n })
            );
            this.notifyProductChanged(id, "stock_updated", { stock: n });
            return true;
          } catch (e4: any) {
            const msg =
              this.firstError(e4) ||
              this.firstError(e3) ||
              this.firstError(e2) ||
              this.firstError(e1) ||
              "No se pudo actualizar el stock";
            throw new Error(msg);
          }
        }
      }
    }
  }

  async updateStock(
    productoId: string | number,
    stock: number
  ): Promise<boolean> {
    return this.setStock(productoId, stock);
  }

  async updateInventory(
    productoId: string | number,
    changes: { stock?: number; stock_actual?: number; stock_minimo?: number }
  ): Promise<boolean> {
    const val = changes.stock ?? changes.stock_actual;
    if (val == null) throw new Error("Falta valor de stock");
    return this.setStock(productoId, Number(val));
  }

  async getStock(productoId: string): Promise<number> {
    try {
      const p = await this.getById(productoId);
      return this.toNumber((p as any)?.stock ?? p.stock_actual ?? 0);
    } catch {
      try {
        const data = await firstValueFrom(
          this.api.get<any>(ProductService.STOCK(productoId))
        );
        return this.toNumber(data?.stock ?? 0);
      } catch {
        return 0;
      }
    }
  }

  // ===== Subida de imágenes
  async uploadImages(idunico: string, files: File[]): Promise<any> {
    const url = `${ProductService.BASE}/${encodeURIComponent(
      idunico
    )}/imagenes`;
    const fd = new FormData();
    if (files.length === 1) fd.append("file", files[0], files[0].name);
    files.forEach((f) => fd.append("files[]", f, f.name));
    try {
      const resp = await firstValueFrom(this.api.post<any>(url, fd));
      // 🔔 notificar imagen subida
      this.notifyProductChanged(String(idunico), "image_uploaded", {
        files: files.map((f) => f.name),
      });
      return resp;
    } catch (e: any) {
      throw new Error(
        this.firstError(e) ?? "No se pudieron subir las imágenes"
      );
    }
  }

  // ===== Compat con pantallas existentes
  getAllProducts(_: string | undefined = undefined): Observable<IProduct[]> {
    return this.getAll$().pipe(map((list) => list.map(this.toIProduct)));
  }
}
