import mongoose, {Schema} from 'mongoose';
import {IAppointment} from '../../Domain/Intefaces/IAppointment';

const appointmentSchema: Schema = new Schema({
  userId: {type: String},
  dentistId: {type: Number},
  requestId: {type: String},
  issuance: {type: String},
  date: {
    type: Date,
  },
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
