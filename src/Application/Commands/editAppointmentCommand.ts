/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';

export class editAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async editAppointment(userId: string, dentistId: string, requestId: string,issuance: string, date: string, newDate:string) {
    console.log(date)
    const checkDate = new Date(newDate)
    //Generating UTC0 since it is the international date stored in the database
    const newAppointment = new Appointment(Number(userId), Number(dentistId), Number(requestId), Number(issuance), new Date(date));
    console.log(newAppointment.date)
    await this.appointmentRepository.updateAppointment(newAppointment, checkDate);
  }
}
