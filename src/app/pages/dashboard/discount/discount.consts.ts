import { title } from "process";
import { DiscountTypeValues } from "src/app/core/consts/enums/business/discount.enum";
import { IDiscount } from "src/app/core/interfaces/bussiness/discount.interface";
import { ISelectOption } from "src/app/core/interfaces/select-options-modal.interface";

export const discountTypeSelectionOptions: Array<ISelectOption> = [
    {
        title: "Monto",
        value: DiscountTypeValues.AMOUNT
    },
    {
        title: "Porcentaje",
        value: DiscountTypeValues.PERCENTAGE
    }
];