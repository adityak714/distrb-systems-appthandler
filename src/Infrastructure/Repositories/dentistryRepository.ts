/* eslint-disable prettier/prettier */
import {IDentistryRepository} from '../../Domain/Intefaces/IDentistryRepository';
import dentists from '../../Files/dentistries.json';
import DentistSchema from '../Models/dentistrySchema';

export class dentistryRepository implements IDentistryRepository {
  async createDentistries(): Promise<void> {
    console.log('Executing the repository');
    for (let i = 0; i < dentists.dentists.length; i++) {
      const checker = await DentistSchema.exists({ name: dentists.dentists[i].name });
      console.log(checker);
      if (checker === null) {
        await DentistSchema.create(dentists.dentists[i]);
      }
    }
  }
}
