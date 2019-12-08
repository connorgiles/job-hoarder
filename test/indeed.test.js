const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'indeed';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser');

// const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function() {
  describe('client', function() {
    const limit = 10;
    const testParams = {
      host: 'ca.indeed.com',
      query: 'Software Engineer',
      limit
    };
    const client = new ATS(testParams);

    it('gets live data', async function() {
      const jobs = await client.getJobs();
      expect(jobs).to.be.an('array');
      expect(jobs.length).to.equal(limit);
      expect(jobs[0]).has.property('id');
    });
  });
});
