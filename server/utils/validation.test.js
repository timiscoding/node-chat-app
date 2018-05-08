import expect from 'expect';
import {isRealString} from './validation';

describe('validation', () => {
  it('should reject for non-string values', () => {
    expect(isRealString(10)).toBe(false);
  });

  it('should reject for string with only spaces', () => {
    expect(isRealString(' ')).toBe(false);
  });

  it('should allow for strings with non-space characters', () => {
    expect(isRealString(' hey ')).toBe(true);
  });
});
