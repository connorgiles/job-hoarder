import nock from 'nock';

import { Greenhouse } from '../src';
import GreenhouseParser from '../src/greenhouse/parser';

import { loadStubs } from './stubs';
const testData = loadStubs('greenhouse');

describe('Greenhouse', () => {
  test('should fail to create instance without company', () => {
    expect(() => new Greenhouse()).toThrow(Error);
  });

  test('should create valid instance with string', () => {
    expect(() => new Greenhouse('test')).not.toThrow();
  });

  test('should create valid instance with object', () => {
    expect(
      () =>
        new Greenhouse({
          companyId: 'test',
        }),
    ).not.toThrow();
  });

  describe('client', () => {
    const testCompanyId = 'test';
    const testCompanyParams = {
      companyId: testCompanyId,
    };
    const testJobId = testData.jobResponse.id;
    const client = new Greenhouse(testCompanyParams);

    test('should retrieve valid job', async () => {
      nock('https://boards-api.greenhouse.io')
        .get(`/v1/boards/${testCompanyId}/jobs/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).toStrictEqual(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async () => {
      nock('https://boards-api.greenhouse.io')
        .get(`/v1/boards/${testCompanyId}/jobs?content=true`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).toStrictEqual(testData.jobsParsed);
    });
  });

  describe('parser', () => {
    const parser = new GreenhouseParser();
    describe('parseJob', () => {
      test('should parse valid string', () => {
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

      test('should not parse null', () => {
        expect(() => parser.parseJob(null)).toThrow(Error);
      });
    });

    describe('parseJobs', () => {
      test('should parse valid response body', () => {
        const parsedJobs = parser.parseJobs(JSON.stringify(testData.jobsResponse));
        expect(parsedJobs).toStrictEqual(testData.jobsParsed);
      });

      test('should parse valid array', () => {
        const parsedJobs = parser.parseJobs(testData.jobsResponse);
        expect(parsedJobs).toStrictEqual(testData.jobsParsed);
      });

      test('should not parse nothing', () => {
        expect(() => parser.parseJobs()).toThrow(Error);
      });

      test('should not parse empty', () => {
        expect(() => parser.parseJobs({})).toThrow(Error);
      });

      test('should not parse null', () => {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
