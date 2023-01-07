import { IAppointment } from "./IAppointment";

export interface IDentistryRepository {
  createDentistries(): Promise<void>;
}
