import cheerio from 'cheerio';

type IndeedResponse = {
  continue: boolean;
  jobs: Array<Job>;
};

export default class IndeedParser {
  private host: string;
  private excludeSponsored: boolean;

  constructor(host: string, excludeSponsored: boolean) {
    this.host = host;
    this.excludeSponsored = excludeSponsored;
  }

  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  parseJobs = (body?: string): IndeedResponse => {
    if (!body) throw new Error('No jobs to parse');
    const $ = cheerio.load(body as string);
    const jobTable = $('#resultsCol');
    const jobs = jobTable.find('.result');
    let cont = true;

    // Filter out ads
    const filtered = this.excludeSponsored
      ? jobs.filter((_, e) => {
          const job = $(e);
          const isSponsored = job.find(
            '.jobsearch-SerpJobCard-footer span:contains("sponsored")'
          );
          return isSponsored == null;
        })
      : jobs;

    // Create objects
    const jobObjects = filtered
      .map((i, e) => {
        const job = $(e);

        const id = job.attr('id')?.trim().split('_')[1];

        const title = job.find('.jobtitle').text().trim();

        const url = 'https://' + this.host + job.find('.jobtitle').attr('href');

        const company = job.find('.company').text().trim() || null;

        const companyUrl = job
          .find('.company a[data-tn-element="companyName"]')
          .attr('href');

        const jobLocation = job.find('.location').text().trim();

        // TODO: Make date field
        const datePosted = job.find('.date').text().trim();

        const salary = job.find('.salary.no-wrap').text().trim();

        return {
          id,
          title,
          url,
          company,
          companyUrl,
          jobLocation,
          datePosted,
          salary,
        };
      })
      .get();

    if (jobTable.children().hasClass('dupetext')) {
      // We haven't seen all the results but indeed says the rest are duplicates
      cont = false;
    } else if ($('.pagination > *:last-child').hasClass('np')) {
      // We have seen all the results
      cont = false;
    }

    return {
      continue: cont,
      jobs: jobObjects,
    };
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  parseJob = (data?: any) => {
    // TODO: Implement parse job
    throw new Error('Function not implemented: Indeed.parseJob');
  };
}
