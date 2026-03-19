const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
    host: 'smtp.seznam.cz',
    port: 465,
    secure: true, 
    auth: {
        user: process.env.EMAIL_ADRESA, 
        pass: process.env.EMAIL_HESLO
    },
    tls: {
        rejectUnauthorized: false
    }
});

transporter.verify(function (error, success) {
  if (error) {
    console.log("CHYBA PRIPOJENI:", error);
  } else {
    console.log("SPOJENI USPESNE!");
  }
});
