const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'jazzAPI';
const ATS = require('../lib/ats/' + ATS_NAME);
const parser = require('../lib/ats/' + ATS_NAME + '/parser')('test');

const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function () {

  it('should fail to create instance without params', function () {
    should.Throw(() => new ATS(), Error);
  });

  it('should fail to create instance without API key', function () {
    should.Throw(() => new ATS('test'), Error);
  });

  it('should create valid instance', function () {
    should.not.Throw(() => new ATS('test', 'test'));
  });

  describe('client', function () {
    const testCompanyId = 'test';
    const testAPIKey = 'test';
    const testJobId = testData.jobResponse.id;
    const client = new ATS(testCompanyId, testAPIKey);

    it('should retrieve valid job', async function () {
      nock('https://api.resumatorapi.com')
        .get(`/v1/jobs/${testJobId}?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(testData.jobParsed).to.deep.equal(job);
    });

    it('should retrieve valid jobs list', async function () {
      nock('https://api.resumatorapi.com')
        .get(`/v1/jobs/status/open/page/1?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const jobs = await client.getJobs();
      expect(testData.jobsParsed).to.deep.equal(jobs);
    });

    it('should retrieve valid job applications', async function () {
      nock('https://api.resumatorapi.com')
        .get(`/v1/applicants/job_id/${testJobId}/page/1?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.applicationsResponse));

      const applications = await client.getApplications(testJobId);
      expect(testData.applicationsParsed).to.deep.equal(applications);
    });
  });

  describe('parser', function () {
    describe('parseJob', function () {
      it('should parse valid job', function () {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobResponse));
        expect(testData.jobParsed).to.deep.equal(parsedJob);
      });

      it('should parse valid object', function () {
        const parsedJob = parser.parseJob(testData.jobResponse);
        expect(testData.jobParsed).to.deep.equal(parsedJob);
      });

      it('should not parse nothing', function () {
        should.Throw(() => parser.parseJob(), Error);
      });

      it('should not parse null', function () {
        should.Throw(() => parser.parseJob(null), Error);
      });
    });

    describe('parseJobs', function () {
      it('should parse valid response body', function () {
        const parsedJobs = parser.parseJobs(JSON.stringify(testData.jobsResponse));
        expect(testData.jobsParsed).to.deep.equal(parsedJobs);
      });

      it('should parse valid array', function () {
        const parsedJobs = parser.parseJobs(testData.jobsResponse);
        expect(testData.jobsParsed).to.deep.equal(parsedJobs);
      });

      it('should not parse nothing', function () {
        should.Throw(() => parser.parseJobs(), Error);
      });

      it('should not parse empty', function () {
        should.Throw(() => parser.parseJobs({}), Error);
      });

      it('should not parse null', function () {
        should.Throw(() => parser.parseJobs(null), Error);
      });
    });

    describe('parseApplications', function () {
      it('should parse valid response body', function () {
        const parsedApplications = parser.parseApplications(JSON.stringify(testData.applicationsResponse));
        expect(testData.applicationsParsed).to.deep.equal(parsedApplications);
      });

      it('should parse valid array', function () {
        const parsedApplications = parser.parseApplications(testData.applicationsResponse);
        expect(testData.applicationsParsed).to.deep.equal(parsedApplications);
      });

      it('should not parse nothing', function () {
        should.Throw(() => parser.parseApplications(), Error);
      });

      it('should not parse null', function () {
        should.Throw(() => parser.parseApplications(null), Error);
      });
    });
  });
});
