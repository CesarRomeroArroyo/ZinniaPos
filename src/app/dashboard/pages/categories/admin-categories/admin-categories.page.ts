import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslationService } from 'src/app/core/services/translation.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProxyService } from 'src/app/core/services/proxy.service';
import { GeneralParams } from 'src/app/core/models/general_params_model';
import { v4 as uuidv4 } from 'uuid';
import { GeneralTax } from 'src/app/core/models/general_tax_model';


@Component({
  selector: 'app-admin-categories',
  templateUrl: './admin-categories.page.html',
  styleUrls: ['./admin-categories.page.scss'],
})
export class AdminCategoriesPage implements OnInit {
  public categoriesForm: FormGroup;
  public taxes: GeneralTax[];
  constructor(
    public translationService: TranslationService,
    private location: Location,
    private formBuilder: FormBuilder,
    private proxyService: ProxyService
  ) {
    this.categoriesForm = this.formBuilder.group({
      name: ['', Validators.required],
      tax: ['', Validators.required]
    });
    this.taxes = [];
  }

  ngOnInit() {
  }

  ionViewWillEnter() {
    this.getTaxes();
  }

  async getTaxes(){
    this.taxes = <GeneralTax[]> await this.proxyService.getMethod("list/general_tax/");
  }

  goBack(){
    this.location.back();
  }

}
