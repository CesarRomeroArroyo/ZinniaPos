import { IonicSafeString } from "@ionic/angular";
import { Color } from '@ionic/core';

export interface IToastMessages {
    [key: string]: IToastOptions
}

export interface IToastOptions {
    message: string | IonicSafeString;
    position?: 'top' | 'bottom' | 'middle';
    color: Color;
    duration?: number;
}