import JazzScrape from '../src/jazzScrape';
import JazzScrapeParser from '../src/jazzScrape/parser';

const ATS_NAME = 'jazzScrape';

describe(ATS_NAME, function () {
  describe('client', function () {
    const client = new JazzScrape('tedconferencesllc');

    test('gets live job data', async function () {
      const jobs = await client.getJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs.length).toBeGreaterThan(0);
      expect(jobs[0]).toHaveProperty('id');
    });
  });

  describe('parser', function () {
    const parser = new JazzScrapeParser();
    describe('parseJob', function () {
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
      test('should not parse nothing', function () {
        expect(() => parser.parseJobs()).toThrow(Error);
      });

      test('should not parse null', function () {
        expect(() => parser.parseJobs(null)).toThrow(Error);
      });
    });
  });
});
