import mongoose, {Schema} from 'mongoose';
import {IAppointment} from '../../Domain/Intefaces/IAppointment';

const appointmentSchema: Schema = new Schema({
  userId: {type: Number},
  dentistId: {type: Number},
  requestId: {type: Number},
  issuance: {type: Number},
  date: {
    type: Date,
  },
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
