import { IDentistryRepository } from "../../Domain/Intefaces/IDentistryRepository";
import dentists from '../Files/dentistries.json';
import Dentists from '../Models/dentistrySchema'

export class DentistryRepository implements IDentistryRepository{
    async createDentistries(): Promise<void> {
        for(let i= 0; i< dentists.dentists.length; i++) {
            Dentists.create(dentists.dentists[i])
          }
    }
}