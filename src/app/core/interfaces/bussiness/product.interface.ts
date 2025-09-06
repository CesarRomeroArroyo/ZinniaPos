// src/app/core/interfaces/bussiness/product.interface.ts
import { IProductCategory } from './product-category.interface';
import { ISupplier } from './supplier.interface';
import { ITax } from './tax.interface';

/** Payload para crear/editar producto en la app (lo mapeas a la API en el service) */
export interface IProductPayload {
  userId: string;
  name: string;
  description?: string;
  costPrice?: number;     // ← antes estaba con typo y como string
  salePrice: number;      // ← número
  stock?: number;
  categoryId: string;     // id de categoría
  supplierId?: string;    // id de proveedor (opcional)
  taxId?: string;         // si manejas catálogo de impuestos; si no, usa taxValue:number en su lugar
  images?: string[];
}

/** Modelo que usa la UI (normalizado) */
export interface IProduct {
  id: string;
  name: string;
  description: string;
  costPrice: number;
  salePrice: number;
  stock: number;
  category: IProductCategory;  // objeto categoría
  supplier?: ISupplier;        // ← antes era supplierId: ISupplier (incongruente)
  tax?: ITax;                  // puede ser opcional si no siempre viene
  images?: string[];
  status?: 'Activo' | 'Inactivo';
  createdAt?: string;
  updatedAt?: string;
}
