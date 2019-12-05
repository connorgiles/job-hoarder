const decode = require('unescape');
const cheerio = require('cheerio');

module.exports = () => {
  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  const parseJobs = data => {
    if (!data) throw new Error('No jobs to parse');

    const jobs = [];

    const $ = cheerio.load(data);
    $('.jobs-list ul li.list-group-item').each(function(i, elem) {
      const job = $(this);
      const url = job.find('a').attr('href');
      const idMatch = url.match(/.+apply\/(.+)\/.+/);
      jobs.push({
        id: idMatch && idMatch.length > 1 ? idMatch[1] : null,
        url: url,
        title: job.title,
        datePosted: null,
        jobLocation: job
          .find('.fa-map-marker')
          .parent()
          .text(),
        department: job
          .find('.fa-sitemap')
          .parent()
          .text(),
        description: null
      });
    });

    return jobs;
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  const parseJob = data => {
    if (!data) throw new Error('No job to parse');

    const $ = cheerio.load(data);
    const jobObject = JSON.parse(
      $('script[type="application/ld+json"]').html()
    );

    const url = jobObject.url;
    const idMatch = url.match(/.+apply\/(.+)\/.+/);
    const location = jobObject.jobLocation
      ? jobObject.jobLocation.address
      : null;

    const job = {
      id: idMatch && idMatch.length > 1 ? idMatch[1] : null,
      url: url,
      title: jobObject.title,
      datePosted: new Date(jobObject.datePosted),
      jobLocation: location
        ? `${location.addressLocality}, ${location.addressRegion}`
        : null,
      department: $('li[title="Department"]')
        .text()
        .trim(),
      description: jobObject.description
    };

    return job;
  };

  return {
    parseJobs,
    parseJob
  };
};
