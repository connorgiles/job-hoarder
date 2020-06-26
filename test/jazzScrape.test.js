const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'jazzScrape';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser');

// const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function () {
  describe('client', function () {
    const client = new ATS('tedconferencesllc');

    test('gets ive job data', async function () {
      const jobs = await client.getJobs();
      expect(jobs).to.be.an('array');
      expect(jobs.length).to.be.greaterThan(0);
      expect(jobs[0]).has.property('id');
    });
  });

  describe('parser', function () {
    describe('parseJob', function () {
      test('should not parse nothing', function () {
        should.Throw(() => parser.parseJob(), Error);
      });

      test('should not parse empty', function () {
        should.Throw(() => parser.parseJob({}), Error);
      });

      test('should not parse null', function () {
        should.Throw(() => parser.parseJob(null), Error);
      });
    });

    describe('parseJobs', function () {
      test('should not parse nothing', function () {
        should.Throw(() => parser.parseJobs(), Error);
      });

      test('should not parse null', function () {
        should.Throw(() => parser.parseJobs(null), Error);
      });
    });
  });
});
