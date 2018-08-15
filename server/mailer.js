import Email from 'email-templates';
import path from 'path';

const email = new Email({
  message: {
    from: 'no-reply@timiscoding.me',
  },
  // send: true, // uncomment to send emails in dev env
  transport: {
    port: process.env.MAILER_PORT,
    host: process.env.MAILER_HOST,
    auth: {
      user: process.env.MAILER_USERNAME,
      pass: process.env.MAILER_PASSWORD,
    },
  },
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: path.join(__dirname, '../../views/emails/build'),
    },
  },
  views: {
    root: path.join(__dirname, '../../views/emails'),
  },
});

export default email;
