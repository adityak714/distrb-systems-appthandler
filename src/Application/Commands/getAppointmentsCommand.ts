/* eslint-disable prettier/prettier */
import { IDentistryRepository } from "../../Domain/Intefaces/IDentistryRepository";
export class getAppointmentsCommand {
  constructor(private readonly dentistryRepository: IDentistryRepository) {}

  public async getAllAppointments(dentistId: string) : Promise<any[]> {
    return await this.dentistryRepository.getAllAppointments(Number(dentistId));
  }
}
