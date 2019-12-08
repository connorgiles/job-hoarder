const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'linkedin';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser');

// const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function() {
  describe('client', function() {
    const limit = 10;
    const testParams = {
      keywords: 'Software Engineer',
      limit
    };
    const client = new ATS(testParams);
    it('gets live job functions', async function() {
      const codes = await client.getJobFunctionCodes();
      expect(codes).to.be.an('array');
      expect(codes.length).to.be.greaterThan(0);
      expect(codes[0]).has.property('Analyticscode');
    });
  });
});
