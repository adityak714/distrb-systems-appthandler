import {createAppointmentCommand} from '../../Application/Commands/createAppointmentCommand';
import {appointmentRepository} from '../Repositories/appointmentRepository';
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';
import Dentists from '../Models/dentistrySchema'

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);
Dentists.find({}).then(dentists => {
  console.log(dentists)
});
//Execute seeder


console.log("done")

const repository = new appointmentRepository();
const command = new createAppointmentCommand(repository);
new MQTTController(command).subscribe();
