import mongoose, {Schema} from 'mongoose';
import {IDentistry} from '../../Domain/Intefaces/IDentistry';
const dentistrySchema: Schema = new Schema({
  id: {type: Number},
  name: {type: String},
  owner: {type: String},
  dentists: {type: Number},
  address: {type: String},
  city: {type: String},
  coordinate: {
    latitude: {type: mongoose.Types.Decimal128},
    longitude: {type: mongoose.Types.Decimal128},
  },
  openinghours: {
    monday: {type: String},
    tuesday: {type: String},
    wednesday: {type: String},
    thursday: {type: String},
    firday: {type: String},
  },
});

export default mongoose.model<IDentistry>('Dentist', dentistrySchema);
