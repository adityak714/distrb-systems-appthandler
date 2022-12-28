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
        //Generating UTC0 since it is the international date stored in the database
        const newAppointment = new Appointment_1.Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
        return await this.appointmentRepository.updateAppointment(newAppointment, new Date(newDate));
    }
}
exports.editAppointmentCommand = editAppointmentCommand;
