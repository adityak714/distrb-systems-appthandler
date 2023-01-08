"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAppointmentCommand = void 0;
/* eslint-disable prettier/prettier */
const Appointment_1 = require("../../Domain/Entities/Appointment");
class createAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async createAppointment(userId, dentistId, requestId, issuance, date) {
        console.log('accessed');
        const newAppointment = new Appointment_1.Appointment(String(userId), Number(dentistId), String(requestId), String(issuance), new Date(date));
        await this.appointmentRepository.registerAppointment(newAppointment);
    }
}
exports.createAppointmentCommand = createAppointmentCommand;
