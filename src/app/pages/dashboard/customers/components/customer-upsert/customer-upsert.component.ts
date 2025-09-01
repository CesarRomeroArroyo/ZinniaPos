// src/app/pages/dashboard/customers/components/customer-upsert/customer-upsert.component.ts
import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ModalController, ToastController } from '@ionic/angular';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { ClientesService, CreateClienteDto } from 'src/app/core/services/bussiness/clientes.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-customer-upsert',
  standalone: true,
  imports: [CommonModule, IonicModule, ReactiveFormsModule],
  templateUrl: './customer-upsert.component.html',
  styleUrls: ['./customer-upsert.component.scss'], // <- necesario para aplicar el SCSS
})
export class CustomerUpsertComponent implements OnInit, OnDestroy {

  loading = false;

  // Config para tu header (si tu shell lo consume)
  settingHeader: any = {
    title: 'Nuevo cliente',
    leftIcon: 'close-outline',
    rightIcon: 'checkmark-outline',
    rightDisabled: true,
    isModal: true,
  };
  actionCompleted = () => this.save(); // el ✓ del header llama a save()

  form = this.fb.nonNullable.group({
    nombre:    ['', [Validators.required, Validators.minLength(2)]],
    correo:    ['', [Validators.required, Validators.email]],
    telefono:  ['', [Validators.required, Validators.minLength(5)]],
    direccion: ['', [Validators.required, Validators.minLength(3)]],
  });

  private sub?: Subscription;

  constructor(
    private fb: FormBuilder,
    private clientesSrv: ClientesService,
    private modalCtrl: ModalController,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    // Habilita/deshabilita ✓ del header según validez/carga
    this.sub = this.form.statusChanges.subscribe(() => {
      this.settingHeader = {
        ...this.settingHeader,
        rightDisabled: this.form.invalid || this.loading,
      };
    });
  }

  ngOnDestroy() { this.sub?.unsubscribe(); }

  async save() {
    if (this.form.invalid || this.loading) {
      this.form.markAllAsTouched();
      (await this.toastCtrl.create({
        message: 'Completa los campos requeridos',
        duration: 1200,
        position: 'bottom',
      })).present();
      return;
    }

    this.loading = true;
    this.settingHeader = { ...this.settingHeader, rightDisabled: true };

    try {
      // timestamp opcional para la API (YYYY-MM-DD HH:mm:ss)
      const nowIso = new Date().toISOString().slice(0, 19).replace('T', ' ');

      const f = this.form.getRawValue();
      const payload: CreateClienteDto = {
        nombre:    String(f.nombre).trim(),
        correo:    String(f.correo).trim(),
        telefono:  String(f.telefono).trim(),
        direccion: String(f.direccion).trim(),
        fecha_registro: nowIso,
      };

      const ok = await this.clientesSrv.createCliente(payload); // devuelve boolean
      if (ok) {
        (await this.toastCtrl.create({
          message: 'Cliente creado',
          duration: 1400,
          position: 'bottom',
        })).present();
        this.modalCtrl.dismiss({ completed: true });
      } else {
        throw new Error('El servidor no confirmó el registro');
      }
    } catch (e: any) {
      (await this.toastCtrl.create({
        message: e?.message || 'No se pudo crear el cliente',
        duration: 1600,
        color: 'danger',
        position: 'bottom',
      })).present();
    } finally {
      this.loading = false;
      this.settingHeader = {
        ...this.settingHeader,
        rightDisabled: this.form.invalid,
      };
    }
  }

  close() { this.modalCtrl.dismiss(); }
}
