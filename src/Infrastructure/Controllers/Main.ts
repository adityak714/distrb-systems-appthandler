import {createAppointmentCommand} from '../../Application/Commands/createAppointmentCommand';
import {appointmentRepository} from '../Repositories/appointmentRepository';
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';
import dentists from '../../Files/dentistries.json'
import Dentists from '../Models/dentistrySchema'

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);
///const allDentists = Dentists.find({});
//console.log(allDentists);
//Execute seeder

for(let i= 0; i< dentists.dentists.length; i++) {
  Dentists.create(dentists.dentists[i])
}
console.log("done")

const repository = new appointmentRepository();
const command = new createAppointmentCommand(repository);
new MQTTController(command).connect();
