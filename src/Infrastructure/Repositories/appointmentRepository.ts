import {IAppointment} from '../../Domain/Intefaces/IAppointment';
import Appointment from '../Models/appointmentSchema';
import {IAppointmentRepository} from '../../Domain/Intefaces/IAppointmentRepository';

export class appointmentRepository implements IAppointmentRepository {
  async registerAppointment(newAppointment: IAppointment): Promise<void> {
    newAppointment.date.setMinutes(0).toString();
    newAppointment.date.setSeconds(0);
    await Appointment.create(newAppointment).toString();
  }
}
