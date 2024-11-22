export interface ISelectOption {
    id: string | number | undefined;
    label: string;
    value: any;
}

export interface ISelectModalConfig {
    headerTitle: string;
    optionsList: ISelectOption[];
    actionButton: boolean;
};
