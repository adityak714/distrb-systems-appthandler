import {IAppointment} from '../../Domain/Intefaces/IAppointment';
import AppointmentSchema from '../Models/appointmentSchema';
import {IAppointmentRepository} from '../../Domain/Intefaces/IAppointmentRepository';

export class appointmentRepository implements IAppointmentRepository {
  async registerAppointment(newAppointment: IAppointment): Promise<string> {
    newAppointment.date.setMinutes(0);
    newAppointment.date.setSeconds(0);
    const appointment = await AppointmentSchema.findOne({
      date: newAppointment.date,
      dentistId: newAppointment.dentistId,
    });
    console.log(appointment);
    if (appointment === null) {
      await AppointmentSchema.create(newAppointment);
      console.log(newAppointment.date);
      return newAppointment.date.toDateString();
    }
    return 'none';
  }
}
