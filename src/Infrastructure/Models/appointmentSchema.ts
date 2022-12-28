import mongoose, {Schema} from 'mongoose';
import {IAppointment} from '../../Domain/Intefaces/IAppointment';

const appointmentSchema: Schema = new Schema({
  userId: {type: Number},
  dentistId: {type: Number},
  requestId: {type: Number},
  issuance: {type: Number},
<<<<<<< HEAD
  date: {type: Date},
=======
  date: {
    type: Date,
  },
>>>>>>> 444b483800f983c1964f44fe5c4ef290af1a3dbb
});

export default mongoose.model<IAppointment>('Appointment', appointmentSchema);
