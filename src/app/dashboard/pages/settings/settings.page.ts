import { Component, OnDestroy, OnInit } from '@angular/core';
import { TranslationService } from 'src/app/core/services/translation.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit, OnDestroy {

  public editorData = '<p>Thanks for your purchase.</p>';
  constructor(
    public translationService: TranslationService,
  ) { 
  }

  ngOnInit() {
  }

  ngOnDestroy(): void {

  }
}
