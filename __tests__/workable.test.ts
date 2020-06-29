import nock from 'nock';

import Workable from '../src/workable';
import WorkableParser from '../src/workable/parser';

import { loadStubs } from './stubs';
const testData = loadStubs('workable');

describe('Workable', () => {
  test('should fail to create instance without company', () => {
    expect(() => new Workable()).toThrow(Error);
  });

  test('should create valid instance with string', () => {
    expect(() => new Workable('TEST')).not.toThrow();
  });

  test('should create valid instance with object', () => {
    expect(
      () =>
        new Workable({
          companyId: 'TEST',
        }),
    ).not.toThrow();
  });

  describe('client', () => {
    const testCompanyId = 'TEST';
    const testJobId = testData.jobResponse.id;
    const client = new Workable(testCompanyId);

    test('should retrieve valid job', async () => {
      nock('https://careers-page.workable.com')
        .get(`/api/v1/accounts/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).toStrictEqual(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async () => {
      nock('https://careers-page.workable.com')
        .post(`/api/v1/accounts/${testCompanyId}/jobs`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).toStrictEqual(testData.jobsParsed);
    });
  });

  describe('parser', () => {
    const parser = new WorkableParser('TEST');

    describe('parseJob', () => {
      test('should parse valid job', () => {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobResponse));
        expect(parsedJob).toStrictEqual(testData.jobParsed);
      });

      test('should parse valid object', () => {
        const parsedJob = parser.parseJob(testData.jobResponse);
        expect(parsedJob).toStrictEqual(testData.jobParsed);
      });

      test('should not parse nothing', () => {
        expect(() => parser.parseJob()).toThrow(Error);
      });

      test('should not parse empty', () => {
        expect(() => parser.parseJob({})).toThrow(Error);
      });

      test('should not parse null', () => {
        expect(() => parser.parseJob(null)).toThrow(Error);
      });
    });

    describe('parseJobs', () => {
      test('should parse valid response body', () => {
        const parsedJobs = parser.parseJobs(JSON.stringify(testData.jobsResponse.results));
        expect(parsedJobs).toStrictEqual(testData.jobsParsed);
      });

      test('should not parse nothing', () => {
        expect(() => parser.parseJobs()).toThrow(Error);
      });

      test('should not parse null', () => {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
