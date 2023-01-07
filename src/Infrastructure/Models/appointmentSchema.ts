import mongoose, {Schema} from 'mongoose';
import {IAppointment} from '../../Domain/Intefaces/IAppointment';

const appointmentSchema: Schema = new Schema({
  userId: {type: String},
  dentistId: {type: Number},
<<<<<<< HEAD
  requestId: {type: Number},
  issuance: {type: Number},
  date: {type: Date},
=======
  requestId: {type: String},
  issuance: {type: String},
  date: {
    type: Date,
  },
>>>>>>> 7199129f506a600d4d10f9f7dd4fa7d39a349e03
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
