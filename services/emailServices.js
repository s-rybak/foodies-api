import nodemailer from 'nodemailer';
import path from 'node:path';
import { defaultPublicFolderName } from '../constants/constants.js';

const {
  MAILER_HOST,
  MAILER_PORT,
  MAILER_FROM_EMAIL,
  MAILER_FROM_NAME,
  MAILER_PASSWORD,
} = process.env;

const nodemailerConfig = {
  host: MAILER_HOST,
  port: MAILER_PORT, // 25, 465, 587, 2525
  secureConnection: true, // we need to disable secureConnection because we use SSLv3 for icloud
  auth: {
    user: MAILER_FROM_EMAIL,
    pass: MAILER_PASSWORD,
  },
  tls: {
    ciphers: 'SSLv3', // because of icloud mail
    rejectUnauthorized: false,
  },
};

const from = {
  name: MAILER_FROM_NAME,
  address: MAILER_FROM_EMAIL,
};

const transporter = nodemailer.createTransport(nodemailerConfig);

const sendEmail = data => {
  const emailOptions = {
    ...data,
    from,
    attachments: [
      {
        filename: 'logo.png',
        path: path.resolve(defaultPublicFolderName, 'logo.png'),
        cid: 'logo@foodies-api',
      },
    ],
  };
  return transporter.sendMail(emailOptions);
};

export default { sendEmail };
