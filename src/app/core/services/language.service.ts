import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {

  constructor() { }

  private getFirstBrowserLanguage(): string {
    const nav: Navigator = window.navigator;
    const browserLanguagePropertyKeys = ['language', 'browserLanguage', 'systemLanguage', 'userLanguage'];
    let i = 0;
    let language = '';
    
    
  
    return nav['language'];
  }

  public getCurrentLanguage(): string {
      let language: string = this.getFirstBrowserLanguage() || 'en-US';
      if (language.indexOf('-') !== -1) {
          language = language.split('-')[0];
      }
      if (language.indexOf('_') !== -1) {
          language = language.split('_')[0];
      }
      if (language === '') {
          language = 'en';
      }
      return language;
  }

  public getCurrentLocale(): string {
      const lang = this.getCurrentLanguage();
      console.log(lang);
      let locale = 'en-US';
      switch (lang.toLowerCase()) {
          case 'en':
              locale = 'en-US';
              break;
          case 'es':
              locale = 'es-ES';
              break;
          case 'it':
              locale = 'it-IT';
              break;
          case 'fr':
              locale = 'fr-FR';
              break;
      }
      return locale;
  }
}
