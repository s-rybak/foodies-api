import nodemailer from "nodemailer";

const {
  MAILER_HOST,
  MAILER_PORT,
  MAILER_FROM_EMAIL,
  UKR_NET_FROM_NAME,
  MAILER_PASSWORD,
} = process.env;

const nodemailerConfig = {
  host: MAILER_HOST,
  port: MAILER_PORT, // 25, 465, 587, 2525
  secureConnection: false, // we need to disable secureConnection because we use SSLv3 for icloud
  auth: {
    user: MAILER_FROM_EMAIL,
    pass: MAILER_PASSWORD,
  },
  tls: {
    ciphers: "SSLv3", // because of icloud mail
  },
};

const from = {
  name: UKR_NET_FROM_NAME,
  address: UKR_NET_FROM_EMAIL,
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
  const emailOptions = { ...data, from };
  return transporter.sendMail(emailOptions);
};

export default sendEmail;
