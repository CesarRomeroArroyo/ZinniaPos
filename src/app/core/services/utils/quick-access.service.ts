import { Injectable } from "@angular/core";
import { StorageKeys } from "../../consts/enums/storage-keys.enum";
import { QuickAccessItem } from "../../interfaces/quick-access-list.interface";
import { SessionStorageService } from "./session-storage.service";
import { avalaibleQuickAccess, quickAccessMap } from "../../consts/values/quick-access.consts";
import { BusinessCategoryId } from "../../consts/enums/business/business-category.enum";

@Injectable({
  providedIn: 'root'
})
export class QuickAccessService {

    private readonly STOREGE_KEY = StorageKeys.QUICK_ACCESS;
    private readonly QUICK_ACCESS_LIST: QuickAccessItem[] = avalaibleQuickAccess;

    constructor(
        private sessionStorage: SessionStorageService
    ) { }

    public getQuickAccesslist(): Array<QuickAccessItem> {
        return this.QUICK_ACCESS_LIST;
    }

    public getCustomQuickAccess(): Array<QuickAccessItem> {
       return this.sessionStorage.getProperty<QuickAccessItem[]>(this.STOREGE_KEY) || [];
    }

    public getQuickAccessByCategory(categoryId: BusinessCategoryId) {
        return quickAccessMap[categoryId] || [];
    }

    public getUserQuickAccess(categoryId: BusinessCategoryId): Array<QuickAccessItem> {
        const customList = this.getCustomQuickAccess();
        const defaultList = this.getQuickAccessByCategory(categoryId);
        return [ ...defaultList, ...customList ];
    }

    public addCustomItem(categoryId: BusinessCategoryId, newItem: QuickAccessItem): void {
        const quickAccess = this.getUserQuickAccess(categoryId);
        const customQuickAccess = this.getCustomQuickAccess();
        const exits = quickAccess.some(i => i.id === newItem.id);
        
        if(!exits) {
            customQuickAccess.push(newItem);
            this.saveCustomQuickAccess(customQuickAccess);
        }
    }

    public removeCustomItem(itemId: string): void {
        const allCustomItems = this.getCustomQuickAccess();
        const updated = allCustomItems.filter(i => !(i.id === itemId));
        this.saveCustomQuickAccess(updated);
    }

    public clearCustomQuickAccess(categoryId: BusinessCategoryId): void {
        this.sessionStorage.removeProperty(this.STOREGE_KEY);
    }

    private saveCustomQuickAccess(quickAccessList: QuickAccessItem[]) {
        this.sessionStorage.setProperty(this.STOREGE_KEY, quickAccessList);
    }

}