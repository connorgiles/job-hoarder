import nock from 'nock';

import Workable from '../src/workable';
import WorkableParser from '../src/workable/parser';

const ATS_NAME = 'workable';
const testData = require('./stubs').loadStubs(ATS_NAME);

describe(ATS_NAME, function () {
  test('should fail to create instance without company', function () {
    expect(() => new Workable()).toThrow(Error);
  });

  test('should create valid instance with string', function () {
    expect(() => new Workable('TEST')).not.toThrow();
  });

  test('should create valid instance with object', function () {
    expect(
      () =>
        new Workable({
          companyId: 'TEST',
        })
    ).not.toThrow();
  });

  describe('client', function () {
    const testCompanyId = 'TEST';
    const testJobId = testData.jobResponse.id;
    const client = new Workable(testCompanyId);

    test('should retrieve valid job', async function () {
      nock('https://careers-page.workable.com')
        .get(`/api/v1/accounts/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).toStrictEqual(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async function () {
      nock('https://careers-page.workable.com')
        .post(`/api/v1/accounts/${testCompanyId}/jobs`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).toStrictEqual(testData.jobsParsed);
    });
  });

  describe('parser', function () {
    const parser = new WorkableParser('TEST');

    describe('parseJob', function () {
      test('should parse valid job', function () {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobResponse));
        expect(parsedJob).toStrictEqual(testData.jobParsed);
      });

      test('should parse valid object', function () {
        const parsedJob = parser.parseJob(testData.jobResponse);
        expect(parsedJob).toStrictEqual(testData.jobParsed);
      });

      test('should not parse nothing', function () {
        expect(() => parser.parseJob()).toThrow(Error);
      });

      test('should not parse empty', function () {
        expect(() => parser.parseJob({})).toThrow(Error);
      });

      test('should not parse null', function () {
        expect(() => parser.parseJob(null)).toThrow(Error);
      });
    });

    describe('parseJobs', function () {
      test('should parse valid response body', function () {
        const parsedJobs = parser.parseJobs(
          JSON.stringify(testData.jobsResponse.results)
        );
        expect(parsedJobs).toStrictEqual(testData.jobsParsed);
      });

      test('should not parse nothing', function () {
        expect(() => parser.parseJobs()).toThrow(Error);
      });

      test('should not parse null', function () {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
