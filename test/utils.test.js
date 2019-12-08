const expect = require('chai').expect;

const { wait, randomUserAgent } = require('../lib/utils');

describe('utils', function() {
  describe('wait', function() {
    it('works as a promise', function(done) {
      wait(10).then(done);
    });
    it('works with async syntax', async function() {
      await wait(10);
    });
  });

  describe('randomUserAgent', function() {
    it('returns a Mozilla user agent', function() {
      const userAgent = randomUserAgent();
      expect(userAgent).contains('Mozilla');
    });
  });
});
