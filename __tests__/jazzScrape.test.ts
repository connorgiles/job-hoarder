import { JazzScrape } from '../src';
import JazzScrapeParser from '../src/jazzScrape/parser';

describe('JazzScrape', () => {
  describe('client', () => {
    const client = new JazzScrape('tedconferencesllc');

    test('gets live job data', async () => {
      const jobs = await client.getJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0]).toHaveProperty('id');
    });
  });

  describe('parser', () => {
    const parser = new JazzScrapeParser();
    describe('parseJob', () => {
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
      test('should not parse nothing', () => {
        expect(() => parser.parseJobs()).toThrow(Error);
      });

      test('should not parse null', () => {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
