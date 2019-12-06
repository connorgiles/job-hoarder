const cheerio = require('cheerio');
const { parse: parseUrl } = require('url');

const parseResourceCodes = body => {
  const $ = cheerio.load(body);
  const table = $('.resource-table-section table tbody');

  // Create array of arrays for table
  const parseValue = (i, e) =>
    $(e)
      .text()
      .trim();
  const parseRow = (i, e) => [
    $(e)
      .children('td')
      .map(parseValue)
      .get()
  ];
  const tableVals = table
    .children()
    .map(parseRow)
    .get();

  // Turn inner-array to object based on first row
  const keys = tableVals.shift().map(v => v.replace(' ', ''));
  const codes = tableVals.map(code =>
    keys.reduce(
      (prev, cur, i) => ({
        ...prev,
        [cur]: code[i]
      }),
      {}
    )
  );

  return codes;
};

const parseDetails = body => {
  const $ = cheerio.load(body);
  /**
   * Helper to parse criteria
   * @param {Number} _ Index of iterator
   * @param {String} e Current element from iterator
   */
  const parseCriteria = (_, e) => {
    const c = $(e);
    const title = c
      .find('.job-criteria__subheader')
      .text()
      .trim();

    const value = c
      .find('.job-criteria__text')
      .map((i, v) =>
        $(v)
          .text()
          .trim()
      )
      .get()
      .join(', ');

    if (title && value) {
      return {
        [title]: value
      };
    }
    return null;
  };
  /**
   * Helper function to merge objects
   * @param {Object} prev Existing object
   * @param {Object} cur New object to add
   */
  const mergeObject = (prev, cur) => ({
    ...prev,
    ...cur
  });

  const description = $('.description__text').html();
  const criteria = $('.job-criteria__list li')
    .map(parseCriteria)
    .get()
    .reduce(mergeObject, {});

  return {
    description,
    criteria
  };
};

/**
 * Parse jobs from request result
 * @param {string} data String of jobs
 * @returns {array} List of parsed jobs
 */
const parseJobs = body => {
  const $ = cheerio.load(body);
  const jobs = $('.job-result-card[data-id]')
    .map((i, e) => {
      const parsed = $(e);
      const id = parsed.attr('data-id');
      const refId = parsed.attr('data-search-id');
      const url =
        'https://linkedin.com' +
        parseUrl(parsed.find('a.result-card__full-card-link').attr('href'))
          .pathname;
      const title = parsed
        .find('.job-result-card__title')
        .text()
        .trim();

      const jobCompany = parsed.find('.job-result-card__subtitle-link');
      const company = jobCompany.text().trim();
      const companyImage = parsed.find('img').attr('data-delayed-url');

      const cLink = jobCompany.attr('href');
      const companyLink = cLink
        ? 'https://linkedin.com' + parseUrl(cLink).pathname
        : null;

      const jobLocation = parsed
        .find('.job-result-card__location')
        .text()
        .trim();

      const date = parsed.find('time').attr('datetime');
      const datePosted = date ? new Date(date) : null;

      return {
        id,
        refId,
        title,
        url,
        company,
        companyLink,
        companyImage,
        jobLocation,
        datePosted
      };
    })
    .get();

  const cont = $('.see-more-jobs').length > 0;

  return jobs;
};

/**
 * Parses job from request result
 * @param {string} data String of job result
 * @returns {object} Object of parsed job
 */
const parseJob = data => {
  // TODO: Implement parse job
  throw new Error('Function not implemented: Indeed.parseJob');
};

module.exports = {
  parseResourceCodes,
  parseDetails,
  parseJobs,
  parseJob
};
