import {Appointment} from '../Entities/Appointment';

export interface IAppointmentRepository {
  registerAppointment(newAppointment: Appointment): Promise<string>;
}
