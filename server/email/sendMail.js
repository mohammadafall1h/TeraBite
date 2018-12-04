const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport(
{
    service: 'Gmail',
    auth:
     {
        user: 'terabitenotifications@gmail.com',
        pass: 'fr33f00d5!',
    },
});
module.exports = function sendEmail(to, subject) 
{
    const mailOptions =
     {
        from: 'terabitenotifications@gmail.com',
        to,
        subject,
        html: 'Hello! An event you have favorited is beginning in two hours. Head to TeraBite now to see more details!',
    };
    transport.sendMail(mailOptions, (error) =>
     {
        if (error) 
        {
            console.log(error);
        }
        console.log('Email sent');
    });
};