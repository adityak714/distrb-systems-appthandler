"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppointmentsCommand = void 0;
class getAppointmentsCommand {
    constructor(dentistryRepository) {
        this.dentistryRepository = dentistryRepository;
    }
    async getAllAppointments(dentistId) {
        return await this.dentistryRepository.getAllAppointments(Number(dentistId));
    }
}
exports.getAppointmentsCommand = getAppointmentsCommand;
