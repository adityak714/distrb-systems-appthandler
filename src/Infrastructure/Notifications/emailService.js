"use strict";
/* eslint-disable prettier/prettier */
/* eslint-disable no-useless-escape */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
// const nodemailer = require('nodemailer'):
// Booking confirmation email, sent when a user books an appointment.
async function mailBookingConfirmation( /*recepient, dentistry, timeslot, date, dentist*/) {
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
        from: '"Dentistimo Team" <dentistimo11@outlook.com',
        to: 'alekseyzorin22@gmail.com',
        subject: 'Your Booking Confirmation',
        text: 'Confirmation of booking!',
        html: '',
        attachments: [
            {
                filename: 'mailLogo.png',
                path: '../../Domain/Assets/mailLogo.png',
                cid: 'mailLogo'
            }
        ]
    });
    console.log('Message sent: %s');
}
mailBookingConfirmation( /*recepient, dentistry, timeslot, date, dentist*/).catch(console.error);
// Booking change email, sent when a user changes an appointment.
async function mailBookingChange( /*recepient, dentistry, timeslot, date, dentist*/) {
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
        from: '"Dentistimo Team" <dentistimo11@outlook.com',
        to: 'alekseyzorin22@gmail.com',
        subject: 'Your Booking Confirmation',
        text: 'You have changed your booking.',
        html: '',
        attachments: [
            {
                filename: 'mailLogo.png',
                path: '../../Domain/Assets/mailLogo.png',
                cid: 'mailLogo'
            }
        ]
    });
    console.log('Message sent: %s');
}
mailBookingChange( /*recepient, dentistry, timeslot, date, dentist*/).catch(console.error);
// Booking deletion email, sent when a user deletes an appointment.
async function mailBookingDeletion( /*recepient, dentistry, timeslot, date, dentist*/) {
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
        from: '"Dentistimo Team" <dentistimo11@outlook.com',
        to: 'alekseyzorin22@gmail.com',
        subject: 'Your Booking Confirmation',
        text: 'You have deleted your booking.',
        html: '',
        attachments: [
            {
                filename: 'mailLogo.png',
                path: '../../Domain/Assets/mailLogo.png',
                cid: 'mailLogo'
            }
        ]
    });
    console.log('Message sent: %s');
}
mailBookingDeletion( /*recepient, dentistry, timeslot, date, dentist*/).catch(console.error);
