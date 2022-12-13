import { IAppointment } from "./IAppointment";

export interface IDentistryRepository {
  createDentistries(): Promise<void>;
  getAllAppointments(dentistId: Number): Promise<any[]>
}
