const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'lever';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser');

const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function() {
  it('should fail to create instance without company', function() {
    should.Throw(() => new ATS(), Error);
  });

  it('should create valid instance with string', function() {
    should.not.Throw(() => new ATS('test'));
  });

  it('should create valid instance with object', function() {
    should.not.Throw(
      () =>
        new ATS({
          companyId: 'test'
        })
    );
  });

  describe('client', function() {
    const testCompanyId = 'test';
    const testJobId = testData.jobResponse.id;
    const client = new ATS(testCompanyId);

    it('should retrieve valid job', async function() {
      nock('https://api.lever.co')
        .get(`/v0/postings/${testCompanyId}/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).to.deep.equal(testData.jobParsed);
    });

    it('should retrieve valid jobs list', async function() {
      nock('https://api.lever.co')
        .get(`/v0/postings/${testCompanyId}?mode=json`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).to.deep.equal(testData.jobsParsed);
    });
  });

  describe('parser', function() {
    describe('parseJob', function() {
      it('should parse valid job', function() {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobResponse));
        expect(parsedJob).to.deep.equal(testData.jobParsed);
      });

      it('should parse valid object', function() {
        const parsedJob = parser.parseJob(testData.jobResponse);
        expect(parsedJob).to.deep.equal(testData.jobParsed);
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
          JSON.stringify(testData.jobsResponse)
        );
        expect(parsedJobs).to.deep.equal(testData.jobsParsed);
      });

      it('should parse valid array', function() {
        const parsedJobs = parser.parseJobs(testData.jobsResponse);
        expect(parsedJobs).to.deep.equal(testData.jobsParsed);
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
