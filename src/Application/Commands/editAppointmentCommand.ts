/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';


export class editAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async editAppointment(userId: string, dentistId: string, requestId: string,issuance: string, date: string, newDate:string) {
    const newAppointment = new Appointment(String(userId), Number(dentistId), String(requestId), String(issuance), new Date(date));
    return await this.appointmentRepository.updateAppointment(newAppointment, new Date (newDate));
  }
}
