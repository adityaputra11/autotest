import { getRandomNumber, getRandomString, getRandomBoolean } from '../src/utils';

describe('utils', () => {
  describe('getRandomNumber', () => {
    it('should return a number between 0 and 99', () => {
      const result = getRandomNumber();
      expect(typeof result).toBe('number');
      expect(result).toBeGreaterThanOrEqual(0);
      expect(result).toBeLessThan(100);
    });
  });

  describe('getRandomString', () => {
    it('should return a random string', () => {
      const result = getRandomString();
      expect(typeof result).toBe('string');
      expect(result.length).toBeGreaterThan(0);
    });

    it('should return different strings on subsequent calls', () => {
      const result1 = getRandomString();
      const result2 = getRandomString();
      expect(result1).not.toBe(result2);
    });
  });

  describe('getRandomBoolean', () => {
    it('should return a boolean value', () => {
      const result = getRandomBoolean();
      expect(typeof result).toBe('boolean');
    });

    it('should eventually return both true and false', () => {
      let hasTrue = false;
      let hasFalse = false;
      
      // Test multiple times to ensure both values can occur
      for (let i = 0; i < 20; i++) {
        const result = getRandomBoolean();
        if (result) hasTrue = true;
        else hasFalse = true;
        if (hasTrue && hasFalse) break;
      }

      expect(hasTrue).toBe(true);
      expect(hasFalse).toBe(true);
    });
  });
});