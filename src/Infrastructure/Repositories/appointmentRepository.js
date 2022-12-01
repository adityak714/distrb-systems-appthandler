"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRepository = void 0;
const appointmentSchema_1 = __importDefault(require("../Models/appointmentSchema"));
class appointmentRepository {
    async registerAppointment(newAppointment) {
        newAppointment.date.setMinutes(0).toString();
        newAppointment.date.setSeconds(0);
        await appointmentSchema_1.default.create(newAppointment).toString();
    }
}
exports.appointmentRepository = appointmentRepository;
