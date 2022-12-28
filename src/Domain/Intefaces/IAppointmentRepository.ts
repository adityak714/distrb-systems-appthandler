import { deleteAppointmentCommand } from '../../Application/Commands/deleteAppointmentCommand';
import {Appointment} from '../Entities/Appointment';

export interface IAppointmentRepository {
  registerAppointment(newAppointment: Appointment): Promise<void>;
  updateAppointment(newAppointment: Appointment, newDate: Date ) : Promise<string>
  deleteAppointment(newAppointment: Appointment): Promise<string>
}
