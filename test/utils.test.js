const expect = require('chai').expect;

const { wait, randomUserAgent } = require('../lib/utils');

describe('utils', function () {
  describe('wait', function () {
    test('works as a promise', function (done) {
      wait(10).then(done);
    });
    test('works with async syntax', async function () {
      await wait(10);
    });
  });

  describe('randomUserAgent', function () {
    test('returns a Mozilla user agent', function () {
      const userAgent = randomUserAgent();
      expect(userAgent).contains('Mozilla');
    });
  });
});
