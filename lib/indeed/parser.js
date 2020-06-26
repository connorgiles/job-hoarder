const cheerio = require('cheerio');

module.exports = (host, excludeSponsored) => {
  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  const parseJobs = (body) => {
    const $ = cheerio.load(body);
    const jobTable = $('#resultsCol');
    const jobs = jobTable.find('.result');
    let cont = true;

    // Filter out ads
    const filtered = excludeSponsored
      ? jobs.filter((_, e) => {
          const job = $(e);
          const footer = job.find('.jobsearch-SerpJobCard-footer');
          const spanText = Array.from(
            footer.find('span').map((_, span) => $(span).text())
          );
          const isSponsered = spanText.some((text) =>
            text.toLowerCase().includes('sponsored')
          );
          return !isSponsered;
        })
      : jobs;

    // Create objects
    const jobObjects = filtered
      .map((i, e) => {
        const job = $(e);

        const id = job.attr('id').trim().split('_')[1];

        const title = job.find('.jobtitle').text().trim();

        const url = 'https://' + host + job.find('.jobtitle').attr('href');

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
  const parseJob = (data) => {
    // TODO: Implement parse job
    throw new Error('Function not implemented: Indeed.parseJob');
  };

  return {
    parseJobs,
    parseJob,
  };
};
