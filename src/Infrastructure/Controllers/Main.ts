import {createAppointmentCommand} from '../../Application/Commands/createAppointmentCommand';
import { editAppointmentCommand } from '../../Application/Commands/editAppointmentCommand';
import {createDentistriesCommand} from '../../Application/Commands/createDentistriesCommand';
import { getAppointmentsCommand } from '../../Application/Commands/getAppointmentsCommand';
import {appointmentRepository} from '../Repositories/appointmentRepository';
import {MQTTController} from './MQTTController';
import mongoose from 'mongoose';
import {dentistryRepository} from '../Repositories/dentistryRepository';
import { deleteAppointmentCommand } from '../../Application/Commands/deleteAppointmentCommand';

/*
mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);
*/

mongoose.connect(
  'mongodb+srv://gusreinaos:4MNbebz6E04hq5IV@cluster0.x1srwma.mongodb.net/test'
);

const repository1 = new dentistryRepository();
repository1.createDentistries().then(object => {
  new createDentistriesCommand(repository1);
  console.log('dentists created');
  const repository2 = new appointmentRepository();
  const command = new createAppointmentCommand(repository2);
  const editCommand = new editAppointmentCommand(repository2);
  const getCommand = new getAppointmentsCommand(repository2);
  const deleteCommand = new deleteAppointmentCommand(repository2);
  new MQTTController(command, editCommand, getCommand, deleteCommand).connect();
});
