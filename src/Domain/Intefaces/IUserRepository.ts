import {User} from '../Entities/User';
export interface IUserRepository {
  getUser(userId: string): Promise<User | null>;
}
