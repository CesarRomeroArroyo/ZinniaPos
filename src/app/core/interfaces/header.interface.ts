export type InferfaceHeader = 'modal' | 'nav';

export interface Iheader {
    title: string,
    interface: InferfaceHeader
};

export type ActionHeaderMap = {
    [key in InferfaceHeader]: () => void;
};