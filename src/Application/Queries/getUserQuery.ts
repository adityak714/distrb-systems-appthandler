import { IUserRepository } from "../../Domain/Intefaces/IUserRepository";
export class getUserQuery {
    constructor(private readonly userRepository: IUserRepository) {}

    public async getUser(userId: string ) {
        return await this.userRepository.getUser(userId)
    }
}