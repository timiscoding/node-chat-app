import nodemailer from 'nodemailer';

const options = {
  port: process.env.MAILER_PORT,
  host: process.env.MAILER_HOST,
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
};

const transporter = nodemailer.createTransport(options);

transporter.verify((err) => {
  if (err) {
    console.log('mailer error:', err);
  } else {
    console.log('Mailer connected and authed');
  }
});

const sendMail = (to, subject, text, html) => transporter.sendMail({
  to,
  from: 'noreply@timiscoding.com',
  subject,
  text,
  html,
});

export { sendMail };
