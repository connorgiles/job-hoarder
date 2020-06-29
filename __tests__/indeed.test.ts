import Indeed from '../src/indeed';
import IndeedParser from '../src/indeed/parser';

describe('Indeed', function () {
  describe('client', function () {
    const limit = 10;
    const testParams = {
      host: 'ca.indeed.com',
      query: 'Software Engineer',
      limit,
    };
    const client = new Indeed(testParams);

    test('gets live data', async function () {
      const jobs = await client.getJobs();
      expect(Array.isArray(jobs)).toBe(true);
      expect(jobs).toHaveLength(limit);
      expect(jobs[0]).toHaveProperty('id');
    });
  });
});
