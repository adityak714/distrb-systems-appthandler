/* eslint-disable prettier/prettier */
import dentistries from '../../Files/dentistries.json'
import nodemailer from 'nodemailer';
// const nodemailer = require('nodemailer'):


  // Booking confirmation email, sent when a user books an appointment.
  export async function mailBookingConfirmation( name: string, recipient: string, dentistry: string, date: string) {
    await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'dentistimo-team@outlook.com',
        pass: 'Dentistimo1234!',
      },
      logger: true,
    });
    await transporter.sendMail({
      from: '"Dentistimo Team" <dentistimo-team@outlook.com',
      to: recipient, // must be email adress.
      subject: 'Your Booking Confirmation',
      text: '',
      html:
      '<body style="margin: auto; width: 75%; display: flex; flex-direction: column; border: 1.5px solid #79c2d0; padding: 20px;">' +
      '<img src="cid:mailLogo" alt="Logo" style="border-radius: 30px; height: 50px; width: 130px;"/><h1 style="color:green;text-align:center;">  Hello ' + name + '! </h1> <br>'+
      '<div1 style="font-size: 28px; padding: 35px;"> Thank you for booking an appointment with <b>Dentistimo</b>! <br>' +
      'Here are your booking details: <br> </div1>' +
      '<div2 style="text-align: justify;"> <ul style="border: 2px solid green; margin: 30px; padding: 20px; padding-left: 5%;">' +
      '<li>Date: ' + date.substring(0, 16).replace('T', ' ') + '</li> <li>Dentistry: ' + dentistries.dentists.find(d => d.id === Number(dentistry))?.name + '</li> </ul> </div2><br/>',
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



  // Booking change email, sent when a user changes an appointment.

  export async function mailBookingChange(recipient: string, dentistry: string, date: string, name: String) {
    await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'dentistimo-team@outlook.com',
        pass: 'Dentistimo1234!',
      },
      logger: true,
    });
    await transporter.sendMail({
      from: '"Dentistimo Team" <dentistimo-team@outlook.com',
      to: recipient, // Need to add recipient email with help of Backend.
      subject: 'Your New Booking Details',
      text: '',
      html:
      '<body style="margin: auto; width: 75%; border: 1.5px solid #79c2d0; padding: 20px;">' +
      '<h1 style="color:green;text-align:center;"> Hello ' + name + '! </h1> <br>'+
      '<div1 style="font-size: 28px; padding: 35px;"> You have changed your dentist appointment at <b>Dentistimo</b>. Here are your new booking details: <br> </div1>' +
      '<div2 style="text-align: justify;"> <div2 style="border: 2px solid green; margin: 30px; padding: 20px; padding-left: 5%; font-size: 18px;">' +
      '<p>Date: ' + date + '</p> <p>Dentistry: ' + dentistries.dentists.find(d => d.id === Number(dentistry))?.name + '</p> </div2> </div2>' +
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


  // Booking deletion email, sent when a user deletes an appointment.

 export async function mailBookingDeletion(recipient: string, dentistry: string, date: string, name: string) {
    await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: 'smtp.office365.com',
      port: 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: 'dentistimo-team@outlook.com',
        pass: 'Dentistimo1234!',
      },
      logger: true,
    });
    await transporter.sendMail({
      from: '"Dentistimo Team" <dentistimo-team@outlook.com',
      to: recipient, // Need to add recipient email with help of Backend.
      subject: 'Deleted Booking',
      text: '',
      html:
      '<body style="margin: auto; width: 75%; border: 1.5px solid #79c2d0; padding: 20px;">' +
      '<h1 style="color:green;text-align:center;"> Hello ' + name + '! </h1> <br>'+
      '<div1 style="font-size: 28px; padding: 35px;"> This is a confirmation that your booking at <b>Dentistimo</b> has been deleted. ' +
      'Deleted booking details: <br> </div1>' +
      '<div2 style="text-align: justify;"> <ul style="border: 2px solid green; margin: 30px; padding: 20px; padding-left: 5%;">' +
      '<li>Date: ' + date + '</li> <li>Dentistry: ' + dentistries.dentists.find(d => d.id === Number(dentistry))?.name + '</li> </ul> </div2>' +
      '<div3> Please do not hesitate to book a new appointment with our Dentistimo web booking service! </div3> <br><br><br>' +
      '<div4 style="font-size:22px;">' + '<br><br><br> </div4> </body>',
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



