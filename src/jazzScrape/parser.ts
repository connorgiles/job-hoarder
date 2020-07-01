import cheerio from 'cheerio';

/**
 * Gets the first match from a string and regex or null
 * @param {String} text text to search from
 * @param {RegEx} pattern regex pattern to match
 */
const getMatch = (text: string | undefined, pattern: RegExp): string | undefined => {
  if (!text) return undefined;
  const match = text.match(pattern);
  return match && match.length > 1 ? match[1] : undefined;
};

export default class JazzScrapeParser implements ClientParser {
  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  public parseJobs = (data?: any): Job[] => {
    if (!data) throw new Error('No jobs to parse');

    const jobs: Job[] = [];

    const $ = cheerio.load(data);
    $('.jobs-list ul li.list-group-item').each((i: number, elem: CheerioElement) => {
      const job = $(elem);

      const url = job.find('a').attr('href');
      const id = getMatch(url, /.+apply\/(.+)\/.+/);

      const title = job.find('a').text().trim();

      const jobLocation = job.find('.fa-map-marker').parent().text();

      const department = job.find('.fa-sitemap').parent().text();

      jobs.push({
        id,
        url,
        title,
        jobLocation,
        department,
      });
    });

    return jobs;
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  public parseJob = (data?: any): Job => {
    if (!data) throw new Error('No job to parse');

    const $ = cheerio.load(data);
    const parsedData = JSON.parse($('script[type="application/ld+json"]').html() as string);

    const {
      title,
      url = '',
      jobLocation: { address: loc },
      datePosted: pDate,
      description,
    } = parsedData || { jobLocation: {} };

    if (!url) {
      // tslint:disable-next-line: no-console
      console.error('Failed to parse job. Data returned:');
      // tslint:disable-next-line: no-console
      console.log(data);
      throw new Error('Failed to parse job');
    }

    const id = getMatch(url, /.+apply\/(.+)\/.+/);

    const datePosted = new Date(pDate);

    const jobLocation = loc ? `${loc.addressLocality}, ${loc.addressRegion}` : undefined;

    const department = $('li[title="Department"]').text().trim();

    return {
      id,
      url,
      title,
      datePosted,
      jobLocation,
      department,
      description,
    };
  };
}
