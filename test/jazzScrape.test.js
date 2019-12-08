const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'jazzScrape';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser');

// const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function() {
  describe('client', function() {
    const client = new ATS('tedconferencesllc');

    it('gets ive job data', async function() {
      const jobs = await client.getJobs();
      expect(jobs).to.be.an('array');
      expect(jobs.length).to.be.greaterThan(0);
      expect(jobs[0]).has.property('id');
    });
  });
});
