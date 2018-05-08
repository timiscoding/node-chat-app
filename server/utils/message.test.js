import expect from 'expect';
import {generateMessage, generateLocationMessage} from './message';

describe('generateMessage', () => {
  it('should generate the correct message object', () => {
    const from = 'test user';
    const text = 'test text';
    const res = generateMessage(from, text);

    expect(res).toInclude({from, text});
    expect(res.createdAt).toBeA('number');
  });
});

describe('generateLocationMessage', () => {
  it('should generate the correct location object', () => {
    const from = 'test user';
    const latitude = 1;
    const longitude = 2;
    const url = 'https://www.google.com/maps?q=1,2';
    const res = generateLocationMessage(from, latitude, longitude);

    expect(res).toInclude({from, url});
    expect(res.createdAt).toBeA('number');
  });
});
