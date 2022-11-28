import mongoose, {Schema} from 'mongoose';
import {IAppointment} from '../../Domain/Intefaces/IAppointment';

const appointmentSchema: Schema = new Schema({
  userId: {type: Number, required: true, unique: false},
  dentistId: {type: Number, required: true, unique: false},
  requestId: {type: Number, required: true, unique: true},
  issuance: {type: Number, required: true, unique: false},
  date: {type: Date, required: true, unique: false},
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
