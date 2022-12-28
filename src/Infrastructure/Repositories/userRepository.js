"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const userSchema_1 = __importDefault(require("../Models/userSchema"));
class UserRepository {
    async getUser(userID) {
        let filter = { _id: userID };
        return await userSchema_1.default.findOne(filter);
    }
}
exports.UserRepository = UserRepository;
