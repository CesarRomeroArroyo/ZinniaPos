export interface ISelectOption {
    title: string;
    subtitle?: string;
    image?: string;
    value: any;
    selected?: boolean,
}

export interface ISelectModalConfig {
    headerTitle: string;
    optionsList: ISelectOption[];
    actionButton: boolean;
    componentToOpen?: any;
    multiple?: boolean;
};
