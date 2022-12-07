import nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
// const nodemailer = require('nodemailer'):
async function main() {
  const nodemailer = await nodemailer.createTestAccount();
  const transporter = nodemailer.createTransport({
    host: 'smtp.office365.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
      user: 'dentistimo11',
      pass: 'Myrslok2022',
    },
    logger: true,
  });
  const info = await transporter.sendMail({
    from: '"Lexa" <dentistimo11@outlook.com',
    to: 'alekseyzorin22@gmail.com',
    subject: 'Fix your teeth',
    text: 'Hello?',
    html: '<b>Hello?</b>',
  });
  console.log('Message sent: %s');
}
main().catch(console.error);
