import { ICustomer } from "src/app/core/interfaces/bussiness/customers.interface";
import { IOrderItem } from "src/app/core/interfaces/bussiness/order.interface";
import { IProduct } from "src/app/core/interfaces/bussiness/product.interface";
import { Iheader } from "src/app/core/interfaces/header.interface";
import { ISelectModalConfig, ISelectOption } from "src/app/core/interfaces/select-options-modal.interface";

export const settingHeader: Iheader = {
    title: 'Crear pedido',
    interface: 'modal'
}

export const customerOptionsModalConfig: ISelectModalConfig = {
    headerTitle: 'Cliente',
    optionsList: [],
    actionButton: true,
    multiple: false,
}

export const productOptionsModalConfig: ISelectModalConfig = {
    headerTitle: 'Productos',
    optionsList: [],
    actionButton: true,
    multiple: true,
}

export function mapObjectToSelectOptions(customers: ICustomer[]): ISelectOption[] {
    return customers.map((customer) => ({
      title: customer.fullname,
      value: customer.id,
    }));
}

export function mapProductToSelectOptions(products: IProduct[]): ISelectOption[] {
    return products.map((product) => ({
      title: product.name,
      subtitle: `$${product.salePrice}`,
      value: product.id,
    }));
}

export function mapProductToOrderItem(product: IProduct, quantity: number = 1): IOrderItem {
  return {
    id: product.id,
    product: product,
    quantity: quantity
  };
}