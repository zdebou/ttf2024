const nodemailer = require("nodemailer");

const mailService = process.env.APP_MAIL_SERVICE;
const mailUser = process.env.APP_MAIL_USER;
const mailPassword = process.env.APP_MAIL_PASSWORD;

const transporter = nodemailer.createTransport({
    service: mailService,
    auth: {
        user: mailUser,
        pass: mailPassword
    },
    tls: {
        rejectUnauthorized: false
    }
});

function sendMail(dst, topic, msg) {
    const mailOptions = {
        from: mailUser,
        to: dst,
        subject: 'TouristX: '+topic,
        text: msg
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                reject(error);
            } else {
                resolve(info);
            }
        });
    });
}

module.exports = {
    sendMail
};
