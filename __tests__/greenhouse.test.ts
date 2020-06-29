import { expect, should as chaiShould } from 'chai';
import nock from 'nock';

import Greehouse from '../src/greenhouse';
import GreehouseParser from '../src/greenhouse/parser';

const ATS_NAME = 'greenhouse';
const testData = require('./stubs').loadStubs(ATS_NAME);
const should = chaiShould();

describe(ATS_NAME, function () {
  test('should fail to create instance without company', function () {
    should.Throw(() => new Greehouse(), Error);
  });

  test('should create valid instance with string', function () {
    should.not.Throw(() => new Greehouse('test'));
  });

  test('should create valid instance with object', function () {
    should.not.Throw(
      () =>
        new Greehouse({
          companyId: 'test',
        })
    );
  });

  describe('client', function () {
    const testCompanyId = 'test';
    const testCompanyParams = {
      companyId: testCompanyId,
    };
    const testJobId = testData.jobResponse.id;
    const client = new Greehouse(testCompanyParams);

    test('should retrieve valid job', async function () {
      nock('https://boards-api.greenhouse.io')
        .get(`/v1/boards/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).to.deep.equal(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async function () {
      nock('https://boards-api.greenhouse.io')
        .get(`/v1/boards/${testCompanyId}/jobs?content=true`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).to.deep.equal(testData.jobsParsed);
    });
  });

  describe('parser', function () {
    const parser = new GreehouseParser();
    describe('parseJob', function () {
      test('should parse valid string', function () {
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
  });
});
