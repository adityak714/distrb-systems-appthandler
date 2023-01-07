import {createAppointmentCommand} from '../../Application/Commands/createAppointmentCommand';
import { editAppointmentCommand } from '../../Application/Commands/editAppointmentCommand';
import {createDentistriesCommand} from '../../Application/Commands/createDentistriesCommand';
import { getAppointmentsCommand } from '../../Application/Commands/getAppointmentsCommand';
import {appointmentRepository} from '../Repositories/appointmentRepository';
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';
import {dentistryRepository} from '../Repositories/dentistryRepository';
import { UserRepository } from '../Repositories/userRepository';
import { deleteAppointmentCommand } from '../../Application/Commands/deleteAppointmentCommand';
import { getUserQuery } from '../../Application/Queries/getUserQuery';

/*
mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);
*/

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);

const dentistryrepository = new dentistryRepository();
const userRepository = new UserRepository();
dentistryrepository.createDentistries().then(object => {
  new createDentistriesCommand(dentistryrepository);
  console.log('dentists created');
<<<<<<< HEAD
  const appointmentrepository = new appointmentRepository();
  const command = new createAppointmentCommand(appointmentrepository);
  const editCommand = new editAppointmentCommand(appointmentrepository);
  const getCommand = new getAppointmentsCommand(dentistryrepository);
  const deleteCommand = new deleteAppointmentCommand(appointmentrepository);
  const userQuery= new getUserQuery(userRepository)
  new MQTTController(command, editCommand, getCommand, deleteCommand, userQuery,).connect();
=======
  const repository2 = new appointmentRepository();
  const command = new createAppointmentCommand(repository2);
  const editCommand = new editAppointmentCommand(repository2);
  const getCommand = new getAppointmentsCommand(repository2);
  const deleteCommand = new deleteAppointmentCommand(repository2);
  new MQTTController(command, editCommand, getCommand, deleteCommand).connect();
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
});
