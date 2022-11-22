import {createAppointmentCommand} from '../../Application/Commands/createAppointmentCommand';
import {appointmentRepository} from '../Repositories/appointmentRepository';
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);

//Execute seeder

const repository = new appointmentRepository();
const command = new createAppointmentCommand(repository);
new MQTTController(command).subscribe();
