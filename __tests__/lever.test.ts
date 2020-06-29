import nock from 'nock';

import { Lever } from '../src';
import LeverParser from '../src/lever/parser';

import { loadStubs } from './stubs';
const testData = loadStubs('lever');

describe('Lever', () => {
  test('should fail to create instance without company', () => {
    expect(() => new Lever()).toThrow(Error);
  });

  test('should create valid instance with string', () => {
    expect(() => new Lever('test')).not.toThrow();
  });

  test('should create valid instance with object', () => {
    expect(
      () =>
        new Lever({
          companyId: 'test',
        }),
    ).not.toThrow();
  });

  describe('client', () => {
    const testCompanyId = 'test';
    const testJobId = testData.jobResponse.id;
    const client = new Lever(testCompanyId);

    test('should retrieve valid job', async () => {
      nock('https://api.lever.co')
        .get(`/v0/postings/${testCompanyId}/${testJobId}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).toStrictEqual(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async () => {
      nock('https://api.lever.co')
        .get(`/v0/postings/${testCompanyId}?mode=json`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).toStrictEqual(testData.jobsParsed);
    });
  });

  describe('parser', () => {
    const parser = new LeverParser();
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

      test('should not parse null', () => {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
