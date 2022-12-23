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
        let updatedAppointment = null;
        const filter = { date: newAppointment.date, dentistId: newAppointment.dentistId };
        const update = { date: newDate };
        await appointmentSchema_1.default.findOneAndUpdate(filter, update, { returnDocument: 'after' }).then((appointment) => {
            console.log(appointment);
            if (appointment === null) {
                updatedAppointment = appointment;
            }
        }).catch((err) => {
            console.log(err);
        });
        return updatedAppointment;
    }
    async deleteAppointment(newAppointment) {
        let deletedStatus = 'no';
        const filter = { date: newAppointment.date, dentistId: newAppointment.dentistId };
        await appointmentSchema_1.default.findOneAndDelete(filter).then((appointment) => {
            if (appointment !== null) {
                deletedStatus = 'yes';
                console.log(appointment);
            }
        });
        return deletedStatus;
    }
}
exports.appointmentRepository = appointmentRepository;
