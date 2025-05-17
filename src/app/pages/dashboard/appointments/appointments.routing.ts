import { Routes } from "@angular/router";
import { AppointmentsMainComponent } from "./components/appointments-main/appointments-main.component";
import { InitialSettingComponent } from "./components/initial-setting/initial-setting.component";
import { CustomerUpsertComponent } from "../customers/components/customer-upsert/customer-upsert.component";
import { BusinessHoursComponent } from "./components/business-hours/business-hours.component";

export const appointmentsRoutes: Routes = [
    {
        path: '',
        children: [
            {  
                path: '',
                redirectTo: 'initial-seting',
                pathMatch: 'full'
            },
            {  
                path: 'main',
                component: AppointmentsMainComponent
            },
            {  
                path: 'initial-seting',
                component: InitialSettingComponent,
                data: { showTab: true }
            },
            {   
                path: 'customer-upsert',
                component: CustomerUpsertComponent
            },
            {   
                path: 'business-hours',
                component: BusinessHoursComponent
            },
        ],
    },
];