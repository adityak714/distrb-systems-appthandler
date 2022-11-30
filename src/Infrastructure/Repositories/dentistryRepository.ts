import {IDentistryRepository} from '../../Domain/Intefaces/IDentistryRepository';
import dentists from '../Files/dentistries.json';
import DentistSchema from '../Models/dentistrySchema';

export class dentistryRepository implements IDentistryRepository {
  async createDentistries(): Promise<void> {
    console.log('Executing the repository');
    for (let i = 0; i < dentists.dentists.length; i++) {
      await DentistSchema.create(dentists.dentists[i]);
    }
  }
}
