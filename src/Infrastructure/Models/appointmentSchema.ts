import mongoose, {Schema} from 'mongoose';
import {IAppointment} from '../../Domain/Intefaces/IAppointment';

const appointmentSchema: Schema = new Schema({
  userId: {type: String},
  dentistId: {type: Number, unique: true},
  requestId: {type: String},
  issuance: {type: String, unique: true},
  date: {
    type: Date,
    unique: true,
  },
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
