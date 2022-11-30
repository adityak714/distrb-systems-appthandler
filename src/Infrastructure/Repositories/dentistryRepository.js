"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DentistryRepository = void 0;
const dentistries_json_1 = __importDefault(require("../Files/dentistries.json"));
const dentistrySchema_1 = __importDefault(require("../Models/dentistrySchema"));
class DentistryRepository {
    async createDentistries() {
        for (let i = 0; i < dentistries_json_1.default.dentists.length; i++) {
            dentistrySchema_1.default.create(dentistries_json_1.default.dentists[i]);
        }
    }
}
exports.DentistryRepository = DentistryRepository;
