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
        console.log(date);
        //Generating UTC0 since it is the international date stored in the database
        const newAppointment = new Appointment_1.Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
        console.log(newAppointment.date);
        await this.appointmentRepository.registerAppointment(newAppointment);
    }
}
exports.createAppointmentCommand = createAppointmentCommand;
