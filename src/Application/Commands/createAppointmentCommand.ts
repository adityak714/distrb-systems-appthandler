/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';

export class createAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async createAppointment(userId: string, dentistId: string, issuance: string, date: string): Promise<string> {
    const newAppointment = new Appointment(Number(userId), Number(dentistId), Number(issuance), new Date(date));
    return await this.appointmentRepository.registerAppointment(newAppointment);
  }
}
