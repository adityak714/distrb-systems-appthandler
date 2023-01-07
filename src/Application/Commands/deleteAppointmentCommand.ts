/* eslint-disable prettier/prettier */
import {Appointment} from '../../Domain/Entities/Appointment';
import { IAppointmentRepository } from '../../Domain/Intefaces/IAppointmentRepository';


export class deleteAppointmentCommand {
  constructor(private readonly appointmentRepository: IAppointmentRepository) {}

<<<<<<< HEAD
  public async deleteAppointment(userId: string, dentistId: string, requestId: string,issuance: string, date: string) {
    const appointment = new Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
    return await this.appointmentRepository.deleteAppointment(appointment);
=======
  public async deleteAppointment(userId: string, dentistId: string,  date: string) {
    
    return await this.appointmentRepository.deleteAppointment(new Date(date), Number(dentistId));
  }
  public async deleteAllAppointments(dentistID: string) {
    return await this.appointmentRepository.deleteAllAppointments(Number(dentistID));
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
  }
}
