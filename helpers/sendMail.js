import nodemailer from "nodemailer";
import "dotenv/config";

const {MAILER_PASSWORD, MAILER_FROM, MAILER_HOST, MAILER_PORT} = process.env;

const nodemailerConfig = {
    host: MAILER_HOST,
    port: MAILER_PORT, // 25, 465, 587, 2525
    secureConnection: false, // we need to disable secureConnection because we use SSLv3 for icloud
    auth: {
        user: MAILER_FROM,
        pass: MAILER_PASSWORD,
    },
    tls: {
        ciphers:'SSLv3' // because of icloud mail
    }
};

const transport = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
    const email = {...data, from: MAILER_FROM};

    return transport.sendMail(email);
}

export default sendEmail;