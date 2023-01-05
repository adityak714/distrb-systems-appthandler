"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAppointmentCommand = void 0;
class deleteAppointmentCommand {
    constructor(appointmentRepository) {
        this.appointmentRepository = appointmentRepository;
    }
    async deleteAppointment(userId, dentistId, date) {
        return await this.appointmentRepository.deleteAppointment(new Date(date), Number(dentistId));
    }
    async deleteAllAppointments(dentistID) {
        return await this.appointmentRepository.deleteAllAppointments(Number(dentistID));
    }
}
exports.deleteAppointmentCommand = deleteAppointmentCommand;
