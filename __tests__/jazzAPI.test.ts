import nock from 'nock';

import { JazzAPI } from '../src';
import JazzAPIParser from '../src/jazzAPI/parser';

import { loadStubs } from './stubs';
const testData = loadStubs('jazzAPI');

describe('JazzAPI', () => {
  test('should fail to create instance without params', () => {
    expect(() => new JazzAPI()).toThrow(Error);
  });

  test('should create valid instance', () => {
    expect(
      () =>
        new JazzAPI({
          companyId: 'test',
          apiKey: 'test',
        }),
    ).not.toThrow();
  });

  describe('client', () => {
    const testCompanyId = 'test';
    const testAPIKey = 'test';
    const testJobId = testData.jobResponse.id;
    const client = new JazzAPI({
      companyId: testCompanyId,
      apiKey: testAPIKey,
    });

    test('should retrieve valid job', async () => {
      nock('https://api.resumatorapi.com')
        .get(`/v1/jobs/${testJobId}?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const job = await client.getJob(testJobId);
      expect(job).toStrictEqual(testData.jobParsed);
    });

    test('should retrieve valid jobs list', async () => {
      nock('https://api.resumatorapi.com')
        .get(`/v1/jobs/status/open/page/1?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.jobResponse));

      const jobs = await client.getJobs();
      expect(jobs).toStrictEqual(testData.jobsParsed);
    });

    test('should retrieve valid job applications', async () => {
      nock('https://api.resumatorapi.com')
        .get(`/v1/applicants/job_id/${testJobId}/page/1?apikey=${testAPIKey}`)
        .reply(200, JSON.stringify(testData.applicationsResponse));

      const applications = await client.getApplications(testJobId);
      expect(applications).toStrictEqual(testData.applicationsResponse);
    });
  });

  describe('parser', () => {
    const parser = new JazzAPIParser('test');
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

    describe('parseApplications', () => {
      test('should parse valid response body', () => {
        const parsedApplications = parser.parseApplications(JSON.stringify(testData.applicationsResponse));
        expect(parsedApplications).toStrictEqual(testData.applicationsResponse);
      });

      test('should parse valid array', () => {
        const parsedApplications = parser.parseApplications(testData.applicationsResponse);
        expect(parsedApplications).toStrictEqual(testData.applicationsResponse);
      });

      test('should not parse nothing', () => {
        expect(() => parser.parseApplications()).toThrow(Error);
      });

      test('should not parse null', () => {
        expect(() => parser.parseApplications(null)).toThrow(Error);
      });
    });
  });
});
