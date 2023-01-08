/* eslint-disable prettier/prettier */
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';


export class deleteAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async deleteAppointment(userId: string, dentistId: string,  date: string) {
    return await this.appointmentRepository.deleteAppointment(new Date(date), Number(dentistId));
  }
  public async deleteAllAppointments(dentistID: string) {
    return await this.appointmentRepository.deleteAllAppointments(Number(dentistID));
  }
}
