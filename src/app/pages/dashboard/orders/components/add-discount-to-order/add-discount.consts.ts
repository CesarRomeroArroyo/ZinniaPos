import { Iheader } from "src/app/core/interfaces/header.interface";
import { ISelectModalConfig } from "src/app/core/interfaces/select-options-modal.interface";
import { discountTypeSelectionOptions } from "../../../discount/discount.consts";

export const settingHeader: Iheader = {
    title: 'Agregar descuento',
    interface: 'modal'
}

export const discountTypeOptionsConfig: ISelectModalConfig = {
    headerTitle: 'Tipo de descuento',
    optionsList: discountTypeSelectionOptions,
    actionButton: false,
    multiple: false,
}