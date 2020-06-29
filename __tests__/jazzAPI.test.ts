import { expect, should as chaiShould } from 'chai';
import nock from 'nock';

import JazzAPI from '../src/jazzAPI';
import JazzAPIParser from '../src/jazzAPI/parser';

const ATS_NAME = 'jazzAPI';
const testData = require('./stubs').loadStubs(ATS_NAME);
const should = chaiShould();

describe(ATS_NAME, function () {
  test('should fail to create instance without params', function () {
    should.Throw(() => new JazzAPI(), Error);
  });

  test('should create valid instance', function () {
    should.not.Throw(
      () =>
        new JazzAPI({
          companyId: 'test',
          apiKey: 'test',
        })
    );
  });

  describe('client', function () {
    const testCompanyId = 'test';
    const testAPIKey = 'test';
    const testJobId = testData.jobResponse.id;
    const client = new JazzAPI({
      companyId: testCompanyId,
      apiKey: testAPIKey,
    });

    test('should retrieve valid job', async function () {
      nock('https://api.resumatorapi.com')
        .get(`/v1/jobs/${testJobId}?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).to.deep.equal(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async function () {
      nock('https://api.resumatorapi.com')
        .get(`/v1/jobs/status/open/page/1?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const jobs = await client.getJobs();
      expect(jobs).to.deep.equal(testData.jobsParsed);
    });

    test('should retrieve valid job applications', async function () {
      nock('https://api.resumatorapi.com')
        .get(`/v1/applicants/job_id/${testJobId}/page/1?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.applicationsResponse));

      const applications = await client.getApplications(testJobId);
      expect(applications).to.deep.equal(testData.applicationsResponse);
    });
  });

  describe('parser', function () {
    const parser = new JazzAPIParser('test');
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

      test('should not parse null', function () {
        should.Throw(() => parser.parseJob(null), Error);
      });
    });

    describe('parseJobs', function () {
      test('should parse valid response body', function () {
        const parsedJobs = parser.parseJobs(
          JSON.stringify(testData.jobsResponse)
        );
        expect(parsedJobs).to.deep.equal(testData.jobsParsed);
      });

      test('should parse valid array', function () {
        const parsedJobs = parser.parseJobs(testData.jobsResponse);
        expect(parsedJobs).to.deep.equal(testData.jobsParsed);
      });

      test('should not parse nothing', function () {
        should.Throw(() => parser.parseJobs(), Error);
      });

      test('should not parse empty', function () {
        should.Throw(() => parser.parseJobs({}), Error);
      });

      test('should not parse null', function () {
        should.Throw(() => parser.parseJobs(null), Error);
      });
    });

    describe('parseApplications', function () {
      test('should parse valid response body', function () {
        const parsedApplications = parser.parseApplications(
          JSON.stringify(testData.applicationsResponse)
        );
        expect(parsedApplications).to.deep.equal(testData.applicationsResponse);
      });

      test('should parse valid array', function () {
        const parsedApplications = parser.parseApplications(
          testData.applicationsResponse
        );
        expect(parsedApplications).to.deep.equal(testData.applicationsResponse);
      });

      test('should not parse nothing', function () {
        should.Throw(() => parser.parseApplications(), Error);
      });

      test('should not parse null', function () {
        should.Throw(() => parser.parseApplications(null), Error);
      });
    });
  });
});
