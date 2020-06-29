import nock from 'nock';

import { Collage } from '../src';
import CollageParser from '../src/collage/parser';

import { loadStubs } from './stubs';
const testData = loadStubs('collage');

describe('Collage', () => {
  test('should fail to create instance without company', () => {
    expect(() => new Collage()).toThrow(Error);
  });

  test('should create valid instance with string', () => {
    expect(() => new Collage('test')).not.toThrow();
  });

  test('should create valid instance with object', () => {
    expect(
      () =>
        new Collage({
          companyId: 'test',
        }),
    ).not.toThrow();
  });

  describe('client', () => {
    const testCompanyId = 'test';
    const testCompanyParams = {
      companyId: testCompanyId,
    };
    const testJobId = testData.jobParsed.id;
    const client = new Collage(testCompanyParams);

    test('should retrieve valid job', async () => {
      nock('https://api.collage.co')
        .get(`/v1/positions/${testCompanyId}`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const job = await client.getJob(testJobId);
      expect(job).toStrictEqual(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async () => {
      nock('https://api.collage.co')
        .get(`/v1/positions/${testCompanyId}`)
        .reply(200, JSON.stringify(testData.jobsResponse));

      const jobs = await client.getJobs();
      expect(jobs).toStrictEqual(testData.jobsParsed);
    });
  });

  describe('parser', () => {
    const parser = new CollageParser();
    describe('parseJob', () => {
      test('should parse valid string', () => {
        const parsedJob = parser.parseJob(JSON.stringify(testData.jobsResponse.positions[1]));
        expect(parsedJob).toStrictEqual(testData.jobParsed);
      });

      test('should parse valid object', () => {
        const parsedJob = parser.parseJob(testData.jobsResponse.positions[1]);
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
