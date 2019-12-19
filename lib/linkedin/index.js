const parser = require('./parser');
const rp = require('request-promise');
const { randomUserAgent, wait } = require('../utils');

const getHeaders = () => ({
  'user-agent': randomUserAgent(),
  accept:
    'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3',
  'accept-language': 'en-US,en;q=0.9',
  'cache-control': 'no-cache',
  pragma: 'no-cache',
  'sec-fetch-mode': 'navigate',
  'sec-fetch-site': 'same-origin',
  'sec-fetch-user': '?1',
  'upgrade-insecure-requests': '1'
});

class LinkedIn {
  constructor({
    limit = 1000,
    start = 0,
    enrich = false,
    keywords,
    location,
    jobType,
    experience,
    geography,
    datePosted,
    industry,
    interval = 1500
  } = {}) {
    this.limit = limit;
    this.start = start;
    this.enrich = enrich;
    this.keywords = keywords;
    this.location = location;
    this.jobType = jobType;
    this.experience = experience;
    this.geography = geography;
    this.datePosted = datePosted;
    this.industry = industry;

    this.interval = interval;

    this.parser = parser;
  }

  _buildUrl({ start }) {
    const queryField = (name, value) => (value ? `&${name}=${value}` : '');
    const search = 'https://www.linkedin.com/jobs/search';
    const seeMoreBase =
      'https://www.linkedin.com/jobs-guest/jobs/api/seeMoreJobPostings/search';
    const starting =
      '?trk=guest_job_search_jobs-search-bar_search-submit&redirect=false&position=1&pageNum=0';
    let q = `${start > 0 ? seeMoreBase : search}${starting}`;
    q += queryField('keywords', this.keywords);
    q += queryField('location', this.location);
    q += queryField('f_E', this.experience);
    q += queryField('f_JT', this.jobType);
    q += queryField('f_PP', this.geography);
    q += queryField('f_TP', this.datePosted);
    q += queryField('f_I', this.industry);
    q += queryField('start', start);
    return encodeURI(q);
  }

  static getIndustryCodes() {
    return rp(
      'https://developer.linkedin.com/docs/reference/industry-codes'
    ).then(parser.parseResourceCodes);
  }

  static getSeniorityCodes() {
    return rp(
      'https://developer.linkedin.com/docs/reference/seniority-codes'
    ).then(parser.parseResourceCodes);
  }

  static getJobFunctionCodes() {
    return rp(
      'https://developer.linkedin.com/docs/reference/job-function-codes'
    ).then(parser.parseResourceCodes);
  }

  static getCompanySizeCodes() {
    return rp(
      'https://developer.linkedin.com/docs/reference/company-size-codes'
    ).then(parser.parseResourceCodes);
  }

  static getGeographyCodes() {
    return rp(
      'https://developer.linkedin.com/docs/reference/geography-codes'
    ).then(parser.parseResourceCodes);
  }

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is false
   * @returns {array} List of jobs
   */
  getJobs({
    start: _start = this.start,
    limit: _limit = this.limit,
    enrich = this.enrich
  } = {}) {
    let start = Number(_start);
    const limit = Number(_limit);
    const idHash = {};

    // Recursive function to get jobs until limit
    const getSomeJobs = async (jobs = []) => {
      const url = this._buildUrl({ start });
      await wait(this.interval);
      try {
        const body = await rp(url, {
          headers: getHeaders(),
          referrer: url,
          referrerPolicy: 'no-referrer-when-downgrade'
        });
        let parsed = this.parser.parseJobs(body).filter(j => {
          if (!idHash[j.id]) {
            idHash[j.id] = true;
            return true;
          }
          return false;
        });

        if (parsed.length === 0) return jobs;

        if (enrich) {
          const buildDescriptionUrl = job =>
            `https://www.linkedin.com/jobs-guest/jobs/api/jobPosting/${job.id}?refId=${job.refId}`;

          const enrichJob = async job => {
            const details = await rp(buildDescriptionUrl(job)).then(
              this.parser.parseDetails
            );
            return {
              ...job,
              ...details
            };
          };
          // Enrich with descriptions and criteria
          parsed = await Promise.all(parsed.map(enrichJob));
        }

        jobs = jobs.concat(parsed);

        // If we reach the limit stop looping
        if (jobs.length > limit) {
          while (jobs.length != limit) jobs.pop();
          return jobs;
        }
        // Continue getting more jobs
        start += parsed.length;
        return await getSomeJobs(jobs);
      } catch (error) {
        console.error(error);
        return jobs;
      }
    };

    return getSomeJobs();
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    /*
    return rp(
      `https://api.smartrecruiters.com/v1/companies/${this.boardName}/postings/${id}`
    ).then(parser.parseJob);
    */
    throw new Error('Function not implemented: LinkedIn.getJob');
  }
}

module.exports = LinkedIn;
