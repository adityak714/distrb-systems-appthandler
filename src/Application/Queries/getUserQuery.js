"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserQuery = void 0;
class getUserQuery {
    constructor(userRepository) {
        this.userRepository = userRepository;
    }
    async getUser(userId) {
        return await this.userRepository.getUser(userId);
    }
}
exports.getUserQuery = getUserQuery;
