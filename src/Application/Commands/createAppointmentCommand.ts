/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';

export class createAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async createAppointment(userId: string, dentistId: string, requestId: string,issuance: string, date: string) {
    console.log(date)
    //Generating UTC0 since it is the international date stored in the database
<<<<<<< HEAD
    const newAppointment = new Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
=======
    const newAppointment = new Appointment(String(userId), Number(dentistId), String(requestId), String(issuance), new Date(date));
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
    console.log(newAppointment.date)
    await this.appointmentRepository.registerAppointment(newAppointment);
  }
}
