/* eslint-disable prettier/prettier */
import { IAppointmentRepository } from "../../Domain/Intefaces/IAppointmentRepository";
export class getAppointmentsCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

  public async getAllAppointments(dentistId: string) : Promise<any[]> {
    return await this.appointmentRepository.getAllAppointments(Number(dentistId));
  }
}
