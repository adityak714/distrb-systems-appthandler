"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Appointment = void 0;
class Appointment {
    constructor(userId, dentistId, requestId, issuance, date) {
        this.userId = userId;
        this.dentistId = dentistId;
        this.requestId = requestId;
        this.issuance = issuance;
        this.date = date;
    }
}
exports.Appointment = Appointment;
