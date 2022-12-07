/* eslint-disable prettier/prettier */
import {IAppointment} from '../../Domain/Intefaces/IAppointment';
import Appointment from '../Models/appointmentSchema';
import {IAppointmentRepository} from '../../Domain/Intefaces/IAppointmentRepository';

export class appointmentRepository implements IAppointmentRepository {
  async registerAppointment(newAppointment: IAppointment): Promise<void> {
    if (newAppointment.date.getMinutes() >= 0 && newAppointment.date.getMinutes() <= 29) {
      newAppointment.date.setMinutes(0);
      newAppointment.date.setSeconds(0);
    }
    else if (newAppointment.date.getMinutes() >= 30 && newAppointment.date.getMinutes() <= 59) {
      newAppointment.date.setMinutes(30);
      newAppointment.date.setSeconds(0);
    }
    console.log(newAppointment.date);
    await Appointment.create(newAppointment);
  }
}
