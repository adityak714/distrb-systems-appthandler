"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRepository = void 0;
const appointmentSchema_1 = __importDefault(require("../Models/appointmentSchema"));
class appointmentRepository {
    async registerAppointment(newAppointment) {
        if (newAppointment.date.getMinutes() >= 0 && newAppointment.date.getMinutes() <= 29) {
            newAppointment.date.setMinutes(0);
            newAppointment.date.setSeconds(0);
        }
        else if (newAppointment.date.getMinutes() >= 30 && newAppointment.date.getMinutes() <= 59) {
            newAppointment.date.setMinutes(30);
            newAppointment.date.setSeconds(0);
        }
        console.log(newAppointment.date);
        await appointmentSchema_1.default.create(newAppointment);
    }
    async updateAppointment(newAppointment, newDate) {
        console.log(newDate);
        const filter = { date: newAppointment.date, dentistId: newAppointment.dentistId };
        const update = { date: newDate };
        await appointmentSchema_1.default.updateOne(filter, update).then((appointment) => {
            if (appointment === null) {
                console.log("appointment not updated");
            }
            else {
                console.log("appointment updated" + appointment);
            }
        }).catch((err) => {
            console.log(err);
        });
    }
}
exports.appointmentRepository = appointmentRepository;
