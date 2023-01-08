"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editAppointmentCommand = void 0;
/* eslint-disable prettier/prettier */
const Appointment_1 = require("../../Domain/Entities/Appointment");
class editAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async editAppointment(userId, dentistId, requestId, issuance, date, newDate) {
        const newAppointment = new Appointment_1.Appointment(String(userId), Number(dentistId), String(requestId), String(issuance), new Date(date));
        return await this.appointmentRepository.updateAppointment(newAppointment, new Date(newDate));
    }
}
exports.editAppointmentCommand = editAppointmentCommand;
