import {IUserRepository} from '../../Domain/Intefaces/IUserRepository';
import userSchema from '../Models/userSchema';
import {IUser} from '../../Domain/Intefaces/IUser';
export class UserRepository implements IUserRepository {
  async getUser(userID: string): Promise<IUser | null> {
    const filter = {_id: userID};
    return await userSchema.findOne(filter);
  }
}
