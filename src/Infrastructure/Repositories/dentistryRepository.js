"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dentistryRepository = void 0;
const dentistries_json_1 = __importDefault(require("../Files/dentistries.json"));
const dentistrySchema_1 = __importDefault(require("../Models/dentistrySchema"));
const appointmentSchema_1 = __importDefault(require("../Models/appointmentSchema"));
class dentistryRepository {
    async createDentistries() {
        console.log('Executing the repository');
        for (let i = 0; i < dentistries_json_1.default.dentists.length; i++) {
            const checker = await dentistrySchema_1.default.exists({ name: dentistries_json_1.default.dentists[i].name });
            console.log(checker);
            if (checker === null) {
                await dentistrySchema_1.default.create(dentistries_json_1.default.dentists[i]);
            }
        }
    }
    async getAllAppointments(dentistIdNumber) {
        let allAppointments = [];
        var filter = { dentistId: dentistIdNumber };
        await appointmentSchema_1.default.find(filter).then(appointments => {
            allAppointments = appointments;
            console.log(allAppointments);
        });
        return allAppointments;
    }
}
exports.dentistryRepository = dentistryRepository;
