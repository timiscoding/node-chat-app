import Email from 'email-templates';
import path from 'path';

const transport = {
  port: process.env.MAILER_PORT,
  host: process.env.MAILER_HOST,
  auth: {
    user: process.env.MAILER_USERNAME,
    pass: process.env.MAILER_PASSWORD,
  },
};

const email = new Email({
  message: {
    from: 'no-reply@timiscoding.me',
  },
  // send: true, uncomment to send emails in dev env
  // transport: {
  //   jsonTransport: true,
  // },
  juice: true,
  juiceResources: {
    webResources: {
      relativeTo: path.join(__dirname, '../views/emails/build'),
    },
  },
  views: {
    root: path.join(__dirname, '../views/emails'),
  },
});

email.send({
  template: 'mars',
  message: {
    to: 'some@alien.com',
  },
  locals: {
    name: 'ET',
  },
})
  .then(console.log)
  .catch(console.error);

