/* eslint-disable prettier/prettier */
import nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer'):
async function mailConfirmation() {
  await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
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
    text: 'Hello firstName! This if your confirmation for the appointemnt you booked with Dentistimo. Your time is: Date, time, dentistry', // Plain text version of the message.
    html: '<img src="../../Domain/Assets/image.png" alt="Logo"> <br> <b>Hello firstName!</b> <br> This is your confirmation for the appointment you booked with Dentistimo. Your time is: <br> <i> Date<br> Time<br> Dentistry </i>',
  });
  console.log('Message sent: %s');
}

mailConfirmation().catch(console.error);
