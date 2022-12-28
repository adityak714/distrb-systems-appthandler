"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.editAppointmentCommand = void 0;
/* eslint-disable prettier/prettier */
const Appointment_1 = require("../../Domain/Entities/Appointment");
const convertDate_1 = require("../../Domain/Utils/convertDate");
class editAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async editAppointment(userId, dentistId, requestId, issuance, date, newDate) {
        const convertedDate = (0, convertDate_1.convertDate)(date);
        const checkDate = (0, convertDate_1.convertDate)(newDate);
        //Generating UTC0 since it is the international date stored in the database
        const newAppointment = new Appointment_1.Appointment(userId, Number(dentistId), Number(requestId), Number(issuance), convertedDate);
        return await this.appointmentRepository.updateAppointment(newAppointment, checkDate);
    }
}
exports.editAppointmentCommand = editAppointmentCommand;
