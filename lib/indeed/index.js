const setupParser = require('./parser');
const request = require('request');
const rp = require('request-promise');

let parser;

const cityNameForWeb = city => {
  return city.replace(' ', '+').replace(',', '%2C');
};

class Client {
  constructor(params) {
    if (!params || !params.host)
      throw new Error('Invalid params to instantiate');

    this.host = params.host;
    this.excludeSponsored = params.excludeSponsored || false;

    parser = setupParser(this.host, this.excludeSponsored);
  }

  _buildUrl({
    query = '',
    city = '',
    radius = '25',
    level = '',
    maxAge = '',
    sort = '',
    jobType = '',
    start = '',
    excludeAgencies = false
  }) {
    let q = 'https://' + this.host + '/jobs';
    q += '?q=' + query;
    q += '&l=' + cityNameForWeb(city);
    q += '&radius=' + radius;
    q += '&explvl=' + level;
    q += '&fromage=' + maxAge;
    q += '&sort=' + sort;
    q += '&jt=' + jobType;
    q += '&start=' + start;
    if (excludeAgencies) q += '&sr=directhire';
    return q;
  }

  _buildDescriptionsUrl(jobIds) {
    return `https://${this.host}/rpc/jobdescs?jks=${encodeURIComponent(
      jobIds.join(',')
    )}`;
  }

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is false
   * @returns {array} List of jobs
   */
  getJobs({ limit: _limit = 0, includeDescription, ...query }) {
    return new Promise((resolve, reject) => {
      let start = 0;
      const limit = Number(_limit);
      /* Recursive function that gets jobs until it can't anymore (Or shouldn't) */
      const getSomeJobs = jobs => {
        const url = this._buildUrl({ ...query, start });
        request(url, async (error, response, body) => {
          if (error) return reject(error);
          const parsed = parser.parseJobs(body);
          if (includeDescription) {
            const jobIds = parsed.jobs.map(p => p.id);
            const descriptions = await rp(
              this._buildDescriptionsUrl(jobIds)
            ).then(JSON.parse);
            parsed.jobs = parsed.jobs.map(j => ({
              ...j,
              description: descriptions[j.id]
            }));
          }
          jobs = jobs.concat(parsed.jobs);
          if (parsed.error !== null) {
            // Got an error so reject
            reject(Error);
          } else if (parsed.continue === true) {
            // If we reach the limit stop looping
            if (limit != 0 && jobs.length > limit) {
              while (jobs.length != limit) jobs.pop();
              resolve(jobs);
            } else {
              // Continue getting more jobs
              start += 10;
              getSomeJobs(jobs);
            }
          } else {
            // We got all the jobs so stop looping
            resolve(jobs);
          }
        });
      };
      getSomeJobs([]);
    });
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
  }
}

module.exports = Client;
