"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
class User {
    constructor(jwtToken, name, email, password) {
        this.jwtToken = jwtToken;
        this.name = name;
        this.email = email;
        this.password = password;
    }
}
exports.User = User;
