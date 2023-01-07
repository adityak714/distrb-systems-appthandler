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
<<<<<<< HEAD
        const newAppointment = new Appointment_1.Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), new Date(date));
=======
        const newAppointment = new Appointment_1.Appointment(String(userId), Number(dentistId), String(requestId), String(issuance), new Date(date));
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
        console.log(newAppointment.date);
        await this.appointmentRepository.registerAppointment(newAppointment);
    }
}
exports.createAppointmentCommand = createAppointmentCommand;
