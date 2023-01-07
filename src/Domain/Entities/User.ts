/* eslint-disable prettier/prettier */
import {IUser} from '../Intefaces/IUser';

export class User implements IUser {
  jwtToken: string;
  name: string;
  email: string;
  password: string;

  constructor(jwtToken: string, name: string, email: string, password: string) {
    this.jwtToken = jwtToken;
    this.name = name;
    this.email = email;
    this.password = password;
  }
}
