import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/core/services/translation.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { GeneralCategory } from 'src/app/core/models/general_category_model';
import { GeneralParams } from 'src/app/core/models/general_params_model';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-admin-item',
  templateUrl: './admin-item.page.html',
  styleUrls: ['./admin-item.page.scss'],
})
export class AdminItemPage implements OnInit {
  public itemsForm: FormGroup;
  public categories: GeneralCategory[];
  public params: GeneralParams[];
  public yesnos: GeneralParams[];
  public data: any;
  public columns: Array<any> = [];
  private uniqueid = uuidv4();

  constructor(
    public translationService: TranslationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private proxyService: ProxyService
  ) { 
    this.itemsForm = this.formBuilder.group({
      name: ['', Validators.required],
      category: ['', Validators.required],
      description: ['', Validators.required],
      type: ['', Validators.required],      
      ingredients: ['', Validators.required],
      cooktime: ['', Validators.required],
      calories: ['', Validators.required],
      iteminstock: ['', Validators.required]
    });
    this.categories = [];
    this.yesnos = [];
    this.params = [];
  }

  ngOnInit() {
    
  }

  ionViewWillEnter() {
    this.getParams();
    this.getEnabledCategories();
  }

  async getParams(){
    this.yesnos = <GeneralParams[]> await this.proxyService.getParams('YES_NO');
    this.params = <GeneralParams[]> await this.proxyService.getParams('ITEM_TYPE');
  }

  async getEnabledCategories(){
    this.categories = <GeneralCategory[]> await this.proxyService.getMethod("list/category/");
  }

  goBack(){
    this.location.back();
  }

  getTypeItem(){
    return this.itemsForm.get('type')?.value;
  }

}
