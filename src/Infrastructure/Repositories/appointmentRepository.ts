/* eslint-disable prettier/prettier */
import {IAppointment} from '../../Domain/Intefaces/IAppointment';
import Appointment from '../Models/appointmentSchema';
import {IAppointmentRepository} from '../../Domain/Intefaces/IAppointmentRepository';
import { convertToLocalTime } from '../../Domain/Utils/dateUtils';
import console from 'console';


export class appointmentRepository implements IAppointmentRepository {
  async registerAppointment(newAppointment: IAppointment): Promise<void> {
    if (newAppointment.date.getMinutes() >= 0 && newAppointment.date.getMinutes() <= 29) {
      newAppointment.date.setMinutes(0);
      newAppointment.date.setSeconds(0);
    }
    else if (newAppointment.date.getMinutes() >= 30 && newAppointment.date.getMinutes() <= 59) {
      newAppointment.date.setMinutes(30);
      newAppointment.date.setSeconds(0);
    }
    console.log(newAppointment.date);
    await Appointment.create(newAppointment);
  }
  async updateAppointment(newAppointment: IAppointment, newDate: Date ): Promise<string> {
    console.log(newDate)
    let status: string = ''
    const filter = { date: newAppointment.date,dentistId: newAppointment.dentistId}
    const update = {date: newDate}
    await Appointment.updateOne(filter, update).then((appointment) => {
      console.log(appointment)
      if(appointment.modifiedCount === 0) {
        status = 'not updated'
      }
      else {
        status = 'updated'
      }
    }).catch((err: Error) => {
      console.log(err)
    })
    return status
  }
  async deleteAppointment(newDate: Date, newDentistId: Number): Promise<string> {
    let deletedStatus : string = 'no'
    const filter = { date: newDate, dentistId: newDentistId }
    await Appointment.findOneAndDelete(filter).then((appointment) => {
      if(appointment !== null) {
        deletedStatus = 'yes'
        console.log(appointment)
      }
    })
    return deletedStatus
  }
  async getAllAppointments(dentistIdNumber: Number): Promise<any[]> {
    let allAppointments: any[] = [];
    var filter = {dentistId: dentistIdNumber};
     await Appointment.find(filter).sort({Date: -1}).then(appointments => {
      for(let i= 0; i< appointments.length; i++) {
        const newDate = convertToLocalTime(appointments[i].date, 'sv-SE')
        console.log(newDate)
        let appointment = {
          '_id': appointments[i].id,
          'userId': appointments[i].userId,
          'dentistId': appointments[i].dentistId,
          'requestId': appointments[i].requestId,
          'issuance': appointments[i].issuance,
          'date': newDate
        }
      allAppointments.push(appointment)
     }
    })
     return allAppointments
    }
    async deleteAllAppointments(dentistIdNumber: Number): Promise<string> {
      let deletedStatus : string = 'no'
      var filter = {dentistId: dentistIdNumber};
      await Appointment.deleteMany(filter).then(appointments => {
        if(appointments !== null) {
          deletedStatus = 'yes'
        }
       
      })
      return deletedStatus;
    }
}
