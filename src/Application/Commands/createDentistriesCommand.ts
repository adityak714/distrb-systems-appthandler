/* eslint-disable prettier/prettier */

import { IDentistryRepository } from '../../Domain/Intefaces/IDentistryRepository';

export class createDentistriesCommand {
  constructor(private readonly dentistryRepository: IDentistryRepository) {}

  public async createDentistries() {
    await this.dentistryRepository.createDentistries();
  }
}