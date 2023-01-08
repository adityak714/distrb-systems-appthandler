/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';

export class createAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async createAppointment(userId: string, dentistId: string, requestId: string,issuance: string, date: string) {
    console.log('accessed')
    const newAppointment = new Appointment(String(userId), Number(dentistId), String(requestId), String(issuance), new Date(date));
    await this.appointmentRepository.registerAppointment(newAppointment);
  }
}
