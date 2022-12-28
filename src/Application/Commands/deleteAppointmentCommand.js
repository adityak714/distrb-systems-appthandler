"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentCommand = void 0;
/* eslint-disable prettier/prettier */
const Appointment_1 = require("../../Domain/Entities/Appointment");
class deleteAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async deleteAppointment(userId, dentistId, requestId, issuance, date) {
        const appointment = new Appointment_1.Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
        return await this.appointmentRepository.deleteAppointment(appointment);
    }
}
exports.deleteAppointmentCommand = deleteAppointmentCommand;
