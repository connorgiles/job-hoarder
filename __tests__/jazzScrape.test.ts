import fs from 'fs';
import { JazzScrape } from '../src';
import JazzScrapeParser from '../src/jazzScrape/parser';

import { loadStubs } from './stubs';
const testData = loadStubs('jazzScrape');

describe('JazzScrape', () => {
  describe('client', () => {
    const client = new JazzScrape('tedconferencesllc');
    test('#getJobs()', async () => {
      const jobs = await client.getJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0]).toHaveProperty('id');
      expect(jobs[0]).toHaveProperty('url');
    });
    test('#getJobs({enrich: true})', async () => {
      const jobs = await client.getJobs({ enrich: true });
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0]).toHaveProperty('id');
      expect(jobs[0]).toHaveProperty('url');
      expect(jobs[0]).toHaveProperty('description');
    });
  });

  describe('parser', () => {
    const parser = new JazzScrapeParser();
    describe('parseJob', () => {
      test('should parse valid job', () => {
        const parsedJob = parser.parseJob(testData.jobResponsePage);
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
      test('should not parse nothing', () => {
        expect(() => parser.parseJobs()).toThrow(Error);
      });

      test('should not parse null', () => {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
