/* eslint-disable prettier/prettier */
import {IAppointment} from '../Intefaces/IAppointment';

export class Appointment implements IAppointment {
  userId: string;
  dentistId: number;
  requestId: number;
  issuance: number;
  date: Date;

  constructor(userId: string, dentistId: number, requestId: number, issuance: number, date: Date) {
    this.userId = userId;
    this.dentistId = dentistId;
    this.requestId = requestId;
    this.issuance = issuance;
    this.date = date;
  }
}
