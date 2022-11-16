import {IAppointment} from '../Intefaces/IAppointment';

export class Appointment implements IAppointment {
  userId: number;
  dentistId: number;
  issuance: number;
  date: Date;

  constructor(userId: number, dentistId: number, issuance: number, date: Date) {
    this.userId = userId;
    this.dentistId = dentistId;
    this.issuance = issuance;
    this.date = date;
  }
}
