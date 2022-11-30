"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createAppointmentCommand_1 = require("../../Application/Commands/createAppointmentCommand");
const appointmentRepository_1 = require("../Repositories/appointmentRepository");
const MQTTController_1 = require("./MQTTController");
const mongoose_1 = __importDefault(require("mongoose"));
const dentistrySchema_1 = __importDefault(require("../Models/dentistrySchema"));
mongoose_1.default.connect('mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test');
dentistrySchema_1.default.find({}).then(dentists => {
    console.log(dentists);
});
//Execute seeder
console.log("done");
const repository = new appointmentRepository_1.appointmentRepository();
const command = new createAppointmentCommand_1.createAppointmentCommand(repository);
new MQTTController_1.MQTTController(command).connect();
