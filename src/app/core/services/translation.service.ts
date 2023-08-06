import { Injectable } from '@angular/core';
import { LanguageService } from './language.service';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private engine: any;

  constructor(
    private httpClient: HttpClient,
    private languageService: LanguageService
  ) { }

  public async init(): Promise<void> {
    const language = this.languageService.getCurrentLanguage();
    const languageFilePath: string = 'assets/languages/cc-' + language + '.js';
    //const languageFilePath: string = 'assets/languages/cc-es.js';
    this.engine = await this.httpClient.get(languageFilePath).toPromise();
  }

  public translate(key: string): string {
    return this.engine[key];
  }
}
