import { Routes } from "@angular/router";
import { AppointmentsMainComponent } from "./components/appointments-main/appointments-main.component";
import { InitialSettingComponent } from "./components/initial-setting/initial-setting.component";
import { BusinessHoursComponent } from "./components/business-hours/business-hours.component";
import { AppointmentManagementComponent } from "./components/appointment-management/appointment-management.component";
import { AppointmentsComponent } from "./appointments.component";
import { UpsertAppointmentComponent } from "./components/upsert-appointment/upsert-appointment.component";
import { UpsertAppointmentTypeComponent } from "./components/upsert-appointment-type/upsert-appointment-type.component";

export const appointmentsRoutes: Routes = [
  {
    path: "",
    component: AppointmentsComponent,
    children: [
      {
        path: "",
        redirectTo: "initial-seting",
        pathMatch: "full",
      },
      {
        path: "main",
        component: AppointmentsMainComponent,
      },
      {
        path: "initial-seting",
        component: InitialSettingComponent,
        data: { showTab: true },
      },
      {
        path: "business-hours",
        component: BusinessHoursComponent,
      },
      {
        path: "appointment-management",
        component: AppointmentManagementComponent,
         data: { showTab: true },
      },
      {
        path: "upsert-appointment",
        component: UpsertAppointmentComponent,
      },
       {
        path: "upsert-appointment-type",
        component: UpsertAppointmentTypeComponent,
      },
    ],
  },
];
