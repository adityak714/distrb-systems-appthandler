/* eslint-disable prettier/prettier */
import {IAppointment} from '../Intefaces/IAppointment';

export class Appointment implements IAppointment {
  userId: string;
  dentistId: number;
  requestId: string;
  issuance: string;
  date: Date;

  constructor(userId: string, dentistId: number, requestId: string, issuance: string, date: Date) {
    this.userId = userId;
    this.dentistId = dentistId;
    this.requestId = requestId;
    this.issuance = issuance;
    this.date = date;
  }
}
