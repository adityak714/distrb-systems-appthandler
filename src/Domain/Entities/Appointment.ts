/* eslint-disable prettier/prettier */
import {IAppointment} from '../Intefaces/IAppointment';

export class Appointment implements IAppointment {
  userId: string;
  dentistId: number;
  requestId: string;
  issuance: string;
  date: Date;

<<<<<<< HEAD
  constructor(userId: string, dentistId: number, requestId: number, issuance: number, date: Date) {
=======
  constructor(userId: string, dentistId: number, requestId: string, issuance: string, date: Date) {
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
    this.userId = userId;
    this.dentistId = dentistId;
    this.requestId = requestId;
    this.issuance = issuance;
    this.date = date;
  }
}
