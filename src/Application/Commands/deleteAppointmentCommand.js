"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentCommand = void 0;
/* eslint-disable prettier/prettier */
const Appointment_1 = require("../../Domain/Entities/Appointment");
const convertDate_1 = require("../../Domain/Utils/convertDate");
class deleteAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async deleteAppointment(userId, dentistId, requestId, issuance, date) {
        const convertedDate = (0, convertDate_1.convertDate)(date);
        const appointment = new Appointment_1.Appointment(Number(userId), Number(dentistId), Number(requestId), Number(issuance), convertedDate);
        return await this.appointmentRepository.deleteAppointment(appointment);
    }
}
exports.deleteAppointmentCommand = deleteAppointmentCommand;
