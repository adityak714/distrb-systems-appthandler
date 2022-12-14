"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable prettier/prettier */
const nodemailer_1 = __importDefault(require("nodemailer"));
// const nodemailer = require('nodemailer'):
async function mailConfirmation() {
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
        subject: 'Your Booking Confirmation',
        text: 'Hello firstName! This if your confirmation for the appointemnt you booked with Dentistimo. Your time is: Date, time, dentistry',
        html: '<img src="../../Domain/Assets/image.png" alt="Logo"> <br> <b>Hello firstName!</b> <br> This is your confirmation for the appointment you booked with Dentistimo. Your time is: <br> <i> Date<br> Time<br> Dentistry </i>',
    });
    console.log('Message sent: %s');
}
mailConfirmation().catch(console.error);
