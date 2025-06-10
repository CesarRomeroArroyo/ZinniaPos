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

    public async addCustomItem(categoryId: BusinessCategoryId, newItem: QuickAccessItem): Promise<boolean> {
        const quickAccess = this.getUserQuickAccess(categoryId);
        const customQuickAccess = this.getCustomQuickAccess();
        const exits = quickAccess.some(i => i.id === newItem.id);

        if(exits) { return false; }

        customQuickAccess.push(newItem);
        this.saveCustomQuickAccess(customQuickAccess);
        return true;
    }

    public async removeCustomItem(itemId: string): Promise<boolean> {
        try{
            const allCustomItems = this.getCustomQuickAccess();
            const updated = allCustomItems.filter(i => !(i.id === itemId));
            this.saveCustomQuickAccess(updated);
            return true;
        } catch(error) {
            console.error(error);
            return false;
        }
    }

    public clearCustomQuickAccess(categoryId: BusinessCategoryId): void {
        this.sessionStorage.removeProperty(this.STOREGE_KEY);
    }

    private saveCustomQuickAccess(quickAccessList: QuickAccessItem[]) {
        this.sessionStorage.setProperty(this.STOREGE_KEY, quickAccessList);
    }

}