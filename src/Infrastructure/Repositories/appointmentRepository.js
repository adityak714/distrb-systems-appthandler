"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.appointmentRepository = void 0;
const appointmentSchema_1 = __importDefault(require("../Models/appointmentSchema"));
const dateUtils_1 = require("../../Domain/Utils/dateUtils");
const console_1 = __importDefault(require("console"));
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
        console_1.default.log(newAppointment.date);
        await appointmentSchema_1.default.create(newAppointment);
    }
    async updateAppointment(newAppointment, newDate) {
        console_1.default.log(newDate);
        let status = '';
        const filter = { date: newAppointment.date, dentistId: newAppointment.dentistId };
        const update = { date: newDate };
        await appointmentSchema_1.default.updateOne(filter, update).then((appointment) => {
            console_1.default.log(appointment);
            if (appointment.modifiedCount === 0) {
                status = 'not updated';
            }
            else {
                status = 'updated';
            }
        }).catch((err) => {
            console_1.default.log(err);
        });
        return status;
    }
    async deleteAppointment(newDate, newDentistId) {
        let deletedStatus = 'no';
        const filter = { date: newDate, dentistId: newDentistId };
        await appointmentSchema_1.default.findOneAndDelete(filter).then((appointment) => {
            if (appointment !== null) {
                deletedStatus = 'yes';
                console_1.default.log(appointment);
            }
        });
        return deletedStatus;
    }
    async getAllAppointments(dentistIdNumber) {
        let allAppointments = [];
        var filter = { dentistId: dentistIdNumber };
        await appointmentSchema_1.default.find(filter).sort({ Date: -1 }).then(appointments => {
            for (let i = 0; i < appointments.length; i++) {
                const newDate = (0, dateUtils_1.convertToLocalTime)(appointments[i].date, 'sv-SE');
                console_1.default.log(newDate);
                let appointment = {
                    '_id': appointments[i].id,
                    'userId': appointments[i].userId,
                    'dentistId': appointments[i].dentistId,
                    'requestId': appointments[i].requestId,
                    'issuance': appointments[i].issuance,
                    'date': newDate
                };
                allAppointments.push(appointment);
            }
        });
        return allAppointments;
    }
    async deleteAllAppointments(dentistIdNumber) {
        let deletedStatus = 'no';
        var filter = { dentistId: dentistIdNumber };
        await appointmentSchema_1.default.deleteMany(filter).then(appointments => {
            if (appointments !== null) {
                deletedStatus = 'yes';
            }
        });
        return deletedStatus;
    }
    async getAppointmentsByUserId(userID) {
        let allAppointments = [];
        var filter = { userId: userID };
        await appointmentSchema_1.default.find(filter).then(appointments => {
            for (let i = 0; i < appointments.length; i++) {
                const newDate = (0, dateUtils_1.convertToLocalTime)(appointments[i].date, 'sv-SE');
                console_1.default.log(newDate);
                let appointment = {
                    '_id': appointments[i].id,
                    'userId': appointments[i].userId,
                    'dentistId': appointments[i].dentistId,
                    'requestId': appointments[i].requestId,
                    'issuance': appointments[i].issuance,
                    'date': newDate
                };
                allAppointments.push(appointment);
            }
        });
        return allAppointments;
    }
}
exports.appointmentRepository = appointmentRepository;
