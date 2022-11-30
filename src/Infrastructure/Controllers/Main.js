"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const createAppointmentCommand_1 = require("../../Application/Commands/createAppointmentCommand");
const appointmentRepository_1 = require("../Repositories/appointmentRepository");
const MQTTController_1 = require("./MQTTController");
const mongoose_1 = __importDefault(require("mongoose"));
const dentistries_json_1 = __importDefault(require("../../Files/dentistries.json"));
const dentistrySchema_1 = __importDefault(require("../Models/dentistrySchema"));
mongoose_1.default.connect('mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test');
///const allDentists = Dentists.find({});
//console.log(allDentists);
//Execute seeder
for (let i = 0; i < dentistries_json_1.default.dentists.length; i++) {
    dentistrySchema_1.default.create(dentistries_json_1.default.dentists[i]);
}
console.log("done");
const repository = new appointmentRepository_1.appointmentRepository();
const command = new createAppointmentCommand_1.createAppointmentCommand(repository);
new MQTTController_1.MQTTController(command).connect();
