import chai, { expect } from 'chai';
import chaiHttp from 'chai-http';
import mongoose from 'mongoose';

import server from '../server';

chai.use(chaiHttp);
const User = mongoose.model('User');

describe.only('POST /signup', () => {
  const user = {
    email: 'test@example.com',
    username: 'test',
    password: 'abc123',
    'password-confirm': 'abc123',
  };

  before(async () => {
    await mongoose.connect(process.env.DB_URL);
  });

  beforeEach(async () => {
    await User.remove();
  });

  it('should create a new user', async () => {
    const res = await chai.request(server)
      .post('/signup')
      .type('form')
      .send(user);

    expect(res).to.have.status(200);
    expect(res).to.redirect;
    const newUser = await User.findOne({ username: user.username });
    expect(newUser).to.include({ email: user.email, username: user.username });
  });

  it('should not create a new user with same email', async () => {
    await User.create({ ...user, username: 'not same username' });

    const res = await chai.request(server)
      .post('/signup')
      .type('form')
      .send(user);

    expect(res).to.have.status(200);
    expect(res).to.not.redirect;
    const users = await User.find({ email: user.email });
    expect(users).to.have.length(1);
  });

  it('should not create a new user with same username', async () => {
    await User.create({ ...user, email: 'someotheremail@example.com' });

    const res = await chai.request(server)
      .post('/signup')
      .type('form')
      .send(user);

    expect(res).to.have.status(200);
    expect(res).to.not.redirect;
    const users = await User.find({ username: user.username });
    expect(users).to.have.length(1);
  });

  it('should not create a new user without email', async () => {
    const res = await chai.request(server)
      .post('/signup')
      .type('form')
      .send({ ...user, email: '' });

    expect(res).to.have.status(200);
    expect(res).to.not.redirect;
    const users = await User.find();
    expect(users).to.have.length(0);
  });

  it('should not create a new user without username', async () => {
    const res = await chai.request(server)
      .post('/signup')
      .type('form')
      .send({ ...user, username: '' });

    expect(res).to.have.status(200);
    expect(res).to.not.redirect;
    const users = await User.find();
    expect(users).to.have.length(0);
  });

  it('should not create a new user if password confirmation does not match password field', async () => {
    const res = await chai.request(server)
      .post('/signup')
      .type('form')
      .send({ ...user, 'password-confirm': '321cba' });

    expect(res).to.have.status(200);
    expect(res).to.not.redirect;
    const users = await User.find();
    expect(users).to.have.length(0);
  });
});
