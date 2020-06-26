const assert = require('assert');
const expect = require('chai').expect;
const should = require('chai').should();
const nock = require('nock');

const ATS_NAME = 'workable';
const ATS = require('../lib/' + ATS_NAME);
const parser = require('../lib/' + ATS_NAME + '/parser')('TEST');

const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function () {
  test('should fail to create instance without company', function () {
    should.Throw(() => new ATS(), Error);
  });

  test('should create valid instance with string', function () {
    should.not.Throw(() => new ATS('TEST'));
  });

  test('should create valid instance with object', function () {
    should.not.Throw(
      () =>
        new ATS({
          companyId: 'TEST',
        })
    );
  });

  describe('client', function () {
    const testCompanyId = 'TEST';
    const testJobId = testData.jobResponse.id;
    const client = new ATS(testCompanyId);

    test('should retrieve valid job', async function () {
      nock('https://careers-page.workable.com')
        .get(`/api/v1/accounts/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).to.deep.equal(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async function () {
      nock('https://careers-page.workable.com')
        .post(`/api/v1/accounts/${testCompanyId}/jobs`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).to.deep.equal(testData.jobsParsed);
    });

    test('should retrieve valid enriched jobs list', async function () {
      nock('https://careers-page.workable.com')
        .get(`/api/v1/accounts/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      nock('https://careers-page.workable.com')
        .post(`/api/v1/accounts/${testCompanyId}/jobs`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs({ query: true });
      expect(jobs).to.deep.equal([testData.jobParsed]);
    });
  });

  describe('parser', function () {
    describe('parseJob', function () {
      test('should parse valid job', function () {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobResponse));
        expect(parsedJob).to.deep.equal(testData.jobParsed);
      });

      test('should parse valid object', function () {
        const parsedJob = parser.parseJob(testData.jobResponse);
        expect(parsedJob).to.deep.equal(testData.jobParsed);
      });

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
      test('should parse valid response body', function () {
        const parsedJobs = parser.parseJobs(
          JSON.stringify(testData.jobsResponse.results)
        );
        expect(parsedJobs).to.deep.equal(testData.jobsParsed);
      });

      test('should not parse nothing', function () {
        should.Throw(() => parser.parseJobs(), Error);
      });

      test('should not parse null', function () {
        should.Throw(() => parser.parseJobs(null), Error);
      });
    });
  });
});
