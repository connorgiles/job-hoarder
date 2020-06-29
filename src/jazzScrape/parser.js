import cheerio from 'cheerio';

/**
 * Gets the first match from a string and regex or null
 * @param {String} text text to search from
 * @param {RegEx} pattern regex pattern to match
 */
const getMatch = (text, pattern) => {
  const match = text.match(pattern);
  return match && match.length > 1 ? match[1] : null;
};

/**
 * Parse jobs from request result
 * @param {string} data String of jobs
 * @returns {array} List of parsed jobs
 */
const parseJobs = (data) => {
  if (!data) throw new Error('No jobs to parse');

  const jobs = [];

  const $ = cheerio.load(data);
  $('.jobs-list ul li.list-group-item').each(function (i, elem) {
    const job = $(this);

    const url = job.find('a').attr('href');
    const id = getMatch(url, /.+apply\/(.+)\/.+/);

    const title = job.find('a').text().trim();

    const jobLocation = job.find('.fa-map-marker').parent().text();

    const department = job.find('.fa-sitemap').parent().text();

    jobs.push({
      id,
      url,
      title,
      datePosted: null,
      jobLocation,
      department,
      description: null,
    });
  });

  return jobs;
};

/**
 * Parses job from request result
 * @param {string} data String of job result
 * @returns {object} Object of parsed job
 */
const parseJob = (data) => {
  if (!data) throw new Error('No job to parse');

  const $ = cheerio.load(data);
  const parsedData = JSON.parse($('script[type="application/ld+json"]').html());

  const {
    title,
    url = '',
    jobLocation: { address: loc },
    datePosted: pDate,
    description,
  } = parsedData || { jobLocation: {} };

  if (!url) throw new Error('Invalid job');

  const id = getMatch(url, /.+apply\/(.+)\/.+/);

  const datePosted = new Date(pDate);

  const jobLocation = loc
    ? `${loc.addressLocality}, ${loc.addressRegion}`
    : null;

  const department = $('li[title="Department"]').text().trim();

  const job = {
    id,
    url,
    title,
    datePosted,
    jobLocation,
    department,
    description: description,
  };

  return job;
};

module.exports = {
  parseJobs,
  parseJob,
};
