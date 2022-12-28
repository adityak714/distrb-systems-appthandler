"use strict";
/* eslint-disable prettier/prettier */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailBookingDeletion = exports.mailBookingChange = exports.mailBookingConfirmation = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
// const nodemailer = require('nodemailer'):
// Booking confirmation email, sent when a user books an appointment.
async function mailBookingConfirmation(name, recipient, dentistry, date) {
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
        to: recipient,
        subject: 'Your Booking Confirmation',
        text: '',
        html: '<body style="margin: auto; width: 75%; border: 1.5px solid #79c2d0; padding: 20px;">' +
            '<h1 style="color:green;text-align:center;"> Hello ' + name + '! </h1> <br>' +
            '<div1 style="font-size: 28px; padding: 35px;"> Thank you for booking an appointment with <b>Dentistimo</b>! <br>' +
            'Here are your booking details: <br> </div1>' +
            '<div2 style="text-align: justify;"> <ul style="border: 2px solid green; margin: 30px; padding: 20px; padding-left: 5%;">' +
            '<li>Date: ' + date + '</li> <li>Dentistry: ' + dentistry + '</li> </ul> </div2>' +
            '<div3> If you would like to change or cancel your appointment, please press the buttons below: </div3> <br><br><br>' +
            '<div4 style="font-size:22px;">' +
            '<a href="https.dentistimo.website.edit" style="background-color: #006400; color: white; padding: 15px 32px; text-align: center; display: inline-block;font-size: 16px;">Edit Appointment</a> <br><br>' +
            '<a href="https.dentistimo.website.cancel" style="background-color: #006400; color: white; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;">Cancel Appointment</a> ' +
            '<br><br><br> </div4> </body>',
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
exports.mailBookingConfirmation = mailBookingConfirmation;
// Booking change email, sent when a user changes an appointment.
async function mailBookingChange(recipient, dentistry, date, name) {
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
        to: recipient,
        subject: 'Your New Booking Details',
        text: '',
        html: '<body style="margin: auto; width: 75%; border: 1.5px solid #79c2d0; padding: 20px;">' +
            '<h1 style="color:green;text-align:center;"> Hello ' + name + '! </h1> <br>' +
            '<div1 style="font-size: 28px; padding: 35px;"> You have changed your dentist appointment at <b>Dentistimo</b>. Here are your new booking details: <br> </div1>' +
            '<div2 style="text-align: justify;"> <ul style="border: 2px solid green; margin: 30px; padding: 20px; padding-left: 5%;">' +
            '<li>Date: ' + date + '</li> <li>Dentistry: ' + dentistry + '</li> </ul> </div2>' +
            '<div3> If you would like to change or cancel your appointment, please press the buttons below: </div3> <br><br><br>' +
            '<div4 style="font-size:22px;">' +
            '<a href="https.dentistimo.website.edit" style="background-color: #006400; color: white; padding: 15px 32px; text-align: center; display: inline-block;font-size: 16px;">Edit Appointment</a> <br><br>' +
            '<a href="https.dentistimo.website.cancel" style="background-color: #006400; color: white; padding: 15px 32px; text-align: center; display: inline-block; font-size: 16px;">Cancel Appointment</a> ' +
            '<br><br><br> </div4> </body>',
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
exports.mailBookingChange = mailBookingChange;
// Booking deletion email, sent when a user deletes an appointment.
async function mailBookingDeletion(recipient, dentistry, date, name) {
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
        to: recipient,
        subject: 'Deleted Booking',
        text: '',
        html: '<body style="margin: auto; width: 75%; border: 1.5px solid #79c2d0; padding: 20px;">' +
            '<h1 style="color:green;text-align:center;"> Hello ' + name + '! </h1> <br>' +
            '<div1 style="font-size: 28px; padding: 35px;"> This is a confirmation that your booking at <b>Dentistimo</b> has been deleted. ' +
            'Deleted booking details: <br> </div1>' +
            '<div2 style="text-align: justify;"> <ul style="border: 2px solid green; margin: 30px; padding: 20px; padding-left: 5%;">' +
            '<li>Date: ' + date + '</li> <li>Dentistry: ' + dentistry + '</li> </ul> </div2>' +
            '<div3> Please do not hesitate to book a new appointment with our booking service! </div3> <br><br><br>' +
            '<div4 style="font-size:22px;">' +
            '<a href="https.dentistimo.website.bookAppointment" style="background-color: #006400; color: white; padding: 15px 32px; text-align: center; display: inline-block;font-size: 16px;">Book a new appointment</a> <br><br>' +
            '<br><br><br> </div4> </body>',
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
exports.mailBookingDeletion = mailBookingDeletion;
