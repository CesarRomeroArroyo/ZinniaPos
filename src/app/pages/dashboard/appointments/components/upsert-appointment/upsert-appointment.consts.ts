// AJUSTA la ruta del import si está en otra carpeta
import { Iheader, InferfaceHeader } from 'src/app/core/interfaces/header.interface';

export const upsertAppointmentHeader: Iheader = {
  title: 'Nueva cita',
  interface: 'nav' as InferfaceHeader, // o 'modal' si esta vista se abre en modal
};
