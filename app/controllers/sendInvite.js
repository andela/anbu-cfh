'use strict';
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
module.exports = (req, res) => {
    console.log('this is my test', req.body.email);
    const smtpConfig = {
        host: 'smtp.1and1.com',
        port: 465,
        secure: true,
        auth: {
            user: 'info@thetechlads.info',
            pass: 'N3wPa55w0rd'
        }
    };

    let transporter = nodemailer.createTransport(smtpTransport(smtpConfig));
    transporter.sendMail({
        from: 'cardsforhumanity@anbu.com',
        to: req.body.email,
        subject: 'Game Invite!',
        text: req.body.link
    }, function (error, response) {
        if (error) {
            console.log(error);
        } else {
            console.log('Message sent');
        }
    });
};
