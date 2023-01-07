"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentCommand = void 0;
<<<<<<< HEAD
/* eslint-disable prettier/prettier */
const Appointment_1 = require("../../Domain/Entities/Appointment");
=======
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
class deleteAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
<<<<<<< HEAD
    async deleteAppointment(userId, dentistId, requestId, issuance, date) {
        const appointment = new Appointment_1.Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
        return await this.appointmentRepository.deleteAppointment(appointment);
=======
    async deleteAppointment(userId, dentistId, date) {
        return await this.appointmentRepository.deleteAppointment(new Date(date), Number(dentistId));
    }
    async deleteAllAppointments(dentistID) {
        return await this.appointmentRepository.deleteAllAppointments(Number(dentistID));
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
    }
}
exports.deleteAppointmentCommand = deleteAppointmentCommand;
