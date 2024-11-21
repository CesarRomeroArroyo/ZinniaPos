export interface IListTask {
    label: string;
    completed: boolean;
    onClick?: () => void;
}