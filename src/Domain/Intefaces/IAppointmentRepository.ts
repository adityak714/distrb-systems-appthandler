import { deleteAppointmentCommand } from '../../Application/Commands/deleteAppointmentCommand';
import {Appointment} from '../Entities/Appointment';

export interface IAppointmentRepository {
  registerAppointment(newAppointment: Appointment): Promise<void>;
  updateAppointment(newAppointment: Appointment, newDate: Date ) : Promise<string>
  deleteAppointment(date: Date, dentistId: Number): Promise<string>
  deleteAllAppointments(dentistID: Number): Promise<string>
  getAllAppointments(dentistID: Number): Promise<any[]>
  getAppointmentsByUserId(userId: string): Promise<any[]>
}