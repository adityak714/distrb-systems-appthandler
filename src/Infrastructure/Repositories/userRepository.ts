import { IUserRepository } from "../../Domain/Intefaces/IUserRepository";
import User from "../Models/userSchema";
import { IUser } from "../../Domain/Intefaces/IUser";
export class UserRepository implements IUserRepository {
    async getUser(userID: string) : Promise<IUser | null> {
        let filter = {_id: userID};
        return  await User.findOne(filter);
    }
}