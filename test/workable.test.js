const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'workable';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser')('TEST');

const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function() {
  it('should fail to create instance without company', function() {
    should.Throw(() => new ATS(), Error);
  });

  it('should create valid instance with string', function() {
    should.not.Throw(() => new ATS('TEST'));
  });

  it('should create valid instance with object', function() {
    should.not.Throw(
      () =>
        new ATS({
          companyId: 'TEST'
        })
    );
  });

  describe('client', function() {
    const testCompanyId = 'TEST';
    const testJobId = testData.jobResponse.id;
    const client = new ATS(testCompanyId);

    it('should retrieve valid job', async function() {
      nock('https://careers-page.workable.com')
        .get(`/api/v1/accounts/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(testData.jobParsed).to.deep.equal(job);
    });

    it('should retrieve valid jobs list', async function() {
      nock('https://careers-page.workable.com')
        .post(`/api/v1/accounts/${testCompanyId}/jobs`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(testData.jobsParsed).to.deep.equal(jobs);
    });

    it('should retrieve valid enriched jobs list', async function() {
      nock('https://careers-page.workable.com')
        .get(`/api/v1/accounts/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      nock('https://careers-page.workable.com')
        .post(`/api/v1/accounts/${testCompanyId}/jobs`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs(true);
      expect([testData.jobParsed]).to.deep.equal(jobs);
    });
  });

  describe('parser', function() {
    describe('parseJob', function() {
      it('should parse valid job', function() {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobResponse));
        expect(testData.jobParsed).to.deep.equal(parsedJob);
      });

      it('should parse valid object', function() {
        const parsedJob = parser.parseJob(testData.jobResponse);
        expect(testData.jobParsed).to.deep.equal(parsedJob);
      });

      it('should not parse nothing', function() {
        should.Throw(() => parser.parseJob(), Error);
      });

      it('should not parse empty', function() {
        should.Throw(() => parser.parseJob({}), Error);
      });

      it('should not parse null', function() {
        should.Throw(() => parser.parseJob(null), Error);
      });
    });

    describe('parseJobs', function() {
      it('should parse valid response body', function() {
        const parsedJobs = parser.parseJobs(
          JSON.stringify(testData.jobsResponse.results)
        );
        expect(testData.jobsParsed).to.deep.equal(parsedJobs);
      });

      it('should not parse nothing', function() {
        should.Throw(() => parser.parseJobs(), Error);
      });

      it('should not parse null', function() {
        should.Throw(() => parser.parseJobs(null), Error);
      });
    });
  });
});
