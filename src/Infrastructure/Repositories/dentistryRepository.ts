/* eslint-disable prettier/prettier */
import { IAppointment } from '../../Domain/Intefaces/IAppointment';
import {IDentistryRepository} from '../../Domain/Intefaces/IDentistryRepository';
import dentists from '../../Files/dentistries.json';
import DentistSchema from '../Models/dentistrySchema';
import Appointment from '../Models/appointmentSchema';

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
  async getAllAppointments(dentistIdNumber: Number): Promise<any[]> {
  let allAppointments: any[] = [];
  var filter = {dentistId: dentistIdNumber};
   await Appointment.find(filter).sort({Date: -1}).then(appointments => {
    allAppointments = appointments;
    console.log(allAppointments)
   })
   return allAppointments
  }
}
