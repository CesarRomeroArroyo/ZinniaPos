import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { UpsertAppointmentTypeComponent } from './upsert-appointment-type.component';

describe('UpsertAppointmentTypeComponent', () => {
  let component: UpsertAppointmentTypeComponent;
  let fixture: ComponentFixture<UpsertAppointmentTypeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ UpsertAppointmentTypeComponent ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(UpsertAppointmentTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
