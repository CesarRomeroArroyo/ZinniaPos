import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { CriptoStorageService } from './cripto-storage.service';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor(private storageService: CriptoStorageService) { }


  private subject = new Subject<any>();

   // Set the json data to local
   setItem(key: string, value: any) {
    this.storageService.secureStorage.setItem(key, value);

    if(key === 'zinnia'){
      this.subject.next(true);
    }
  }

  changes(): Observable<boolean> {
    return this.subject.asObservable();
  }

  // Get the json value from local
  getItem(key: string) {
    return this.storageService.secureStorage.getItem(key);
  }


  // Clear the local
  async clearToken() {
    return await this.storageService.secureStorage.clear();
  }
}
