import mailer from 'nodemailer';
import config from '../config/config.js';

export default class MailingService {
  constructor() {
    this.client = mailer.createTransport({
      service: config.mailing.SERVICE,
      host: config.mailing.HOST,
      port: 587,
      auth: {
        user: config.mailing.USER,
        pass: config.mailing.PASSWORD,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  sendSimpleMail = async ({ from, to, subject, html = [] }) => {
    let result = await this.client.sendMail({
      from,
      to,
      subject,
      html,
    });
    console.log(result);
    return result;
  };
}
