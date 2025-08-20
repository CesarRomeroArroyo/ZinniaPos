export interface IListTask {
    label: string;
    completed: boolean;
    component?: any; 
    onClick?: () => void;
}