import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {WizardStep} from "./interfaces/wizard-register-model";
import {UserRegisterInfo, BusinessRegisterInfo} from "./interfaces/register-model";
import {BusinessAccountInfoComponent} from "./components/business-account-info/business-account-info.component";
import {BusinessTypeComponent} from "./components/business-type/business-type.component";
import {UserAccountInfoComponent} from "./components/user-account-info/user-account-info.component";

@Component({
    selector: 'app-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        IonicModule,
        BusinessAccountInfoComponent,
        BusinessTypeComponent,
        UserAccountInfoComponent,
    ]
})
export class RegisterComponent implements OnInit {

    steps: WizardStep[] = [
        {id: 'businessType', label: 'Busineess Type', isValid: false},
        {id: 'businessAccountInfo', label: 'Business Account Information', isValid: false},
        {id: 'userAccountInfo', label: 'User Account Information', isValid: false},
    ];

    currentStepIndex = 0;

    userProfile: UserRegisterInfo = {
        name: '',
        password: '',
        email: ''
    }

    businessInfo: BusinessRegisterInfo = {
        name: '',
        email: '',
        address: '',
        phone: '',
        type: '',
        ruc: ''
    }

    get isLastStep(): boolean {
        return this.currentStepIndex === this.steps.length - 1;
    }

    get isFirstStep(): boolean {
        return this.currentStepIndex === 0;
    }

    nextStep() {
        // if (this.steps[this.currentStepIndex].isValid) {
        //     this.currentStepIndex++;
        // }
        if (this.currentStepIndex < this.steps.length -1){
            this.currentStepIndex++;
        }
        else {
            window.location.href = '/validate-code'
        }

    }

    prevStep() {
        if (this.currentStepIndex >= 0) {
            this.currentStepIndex--;
        }
        if (this.currentStepIndex < 0){
            window.location.href = '/'
        }
    }

    onStepIsValidityChange(isValid: boolean) {
        this.steps[this.currentStepIndex].isValid = isValid;
    }

    constructor() {

    }

    ngOnInit() {
    }
}