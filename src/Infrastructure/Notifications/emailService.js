"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// const nodemailer = require('nodemailer'):
async function main() {
    await nodemailer_1.default.createTestAccount();
    const transporter = nodemailer_1.default.createTransport({
        host: 'smtp.office365.com',
        port: 587,
        secure: false,
        requireTLS: true,
        auth: {
            user: 'dentistimo11@outlook.com',
            pass: 'Myrslok2022',
        },
        logger: true,
    });
    await transporter.sendMail({
        from: '"Lexa" <dentistimo11@outlook.com',
        to: 'alekseyzorin22@gmail.com',
        subject: 'Fix your teeth',
        text: 'Hello?',
        html: '<b>Hello?</b>',
    });
    console.log('Message sent: %s');
}
main().catch(console.error);
