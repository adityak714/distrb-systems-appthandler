/* eslint-disable no-useless-escape */
import mongoose, {Schema} from 'mongoose';
import {IUser} from '../../Domain/Intefaces/IUser';

const userSchema: Schema = new Schema({
  jwtToken: {type: String, required: true},
  name: {type: String, required: true},
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/,
  },
  password: {type: String, required: true},
});

export default mongoose.model<IUser>('User', userSchema);
