import { wait, randomUserAgent } from '../src/utils';

describe('utils', () => {
  describe('wait', () => {
    test('works as a promise', (done) => {
      wait(10).then(done);
    });
    test('works with async syntax', async () => {
      await wait(10);
    });
  });

  describe('randomUserAgent', () => {
    test('returns a Mozilla user agent', () => {
      const userAgent = randomUserAgent();
      expect(userAgent).toMatch(/Mozilla/i);
    });
  });
});
