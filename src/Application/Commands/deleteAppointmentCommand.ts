/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';


export class deleteAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async deleteAppointment(userId: string, dentistId: string, requestId: string,issuance: string, date: string) {
    const appointment = new Appointment(Number(userId), Number(dentistId), Number(requestId), Number(issuance), new Date(date));
    return await this.appointmentRepository.deleteAppointment(appointment);
  }
  public async deleteAllAppointments(dentistID: string) {
    return await this.appointmentRepository.deleteAllAppointments(Number(dentistID));
  }
}
