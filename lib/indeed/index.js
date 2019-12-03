const setupParser = require('./parser');
const rp = require('request-promise');

let parser;

class Client {
  constructor(params) {
    if (!params || !params.host)
      throw new Error('Invalid params to instantiate');

    this.host = params.host || 'www.indeed.com';
    this.query = params.query || '';
    this.city = params.city || '';
    this.radius = params.radius || '25';
    this.level = params.level || '';
    this.maxAge = params.maxAge || '';
    this.sort = params.sort || '';
    this.jobType = params.jobType || '';
    this.excludeSponsored = params.excludeSponsored || false;
    this.includeDescription = params.includeDescription || false;
    this.start = params.start || 0;

    parser = setupParser(this.host);
  }

  _cityNameForWeb() {
    return this.city.replace(' ', '+').replace(',', '%2C');
  }

  _buildURL() {
    let q = 'https://' + this.host + '/jobs';
    q += '?q=' + this.query;
    q += '&l=' + this._cityNameForWeb();
    q += '&radius=' + this.radius;
    q += '&explvl=' + this.level;
    q += '&fromage=' + this.maxAge;
    q += '&sort=' + this.sort;
    q += '&jt=' + this.jobType;
    return q;
  }

  _queryAll(url, limit) {
    return new Promise(async (resolve, reject) => {
      let start = this.start;
      let totalResults = [];
      let result = [];
      try {
        while (page === 0 || totalResults.length < limit) {
          result = await rp(`${url}&start=${start}`).then(JSON.parse);
          result = result.content;
          if (!result) resolve(totalResults);
          totalResults = totalResults.concat(result);
          page++;
        }
      } catch (error) {
        reject(error);
      }
      resolve(totalResults);
    });
  }

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is false
   * @returns {array} List of jobs
   */
  getJobs(limit = 100) {
    return this._queryAll(this._buildURL(), limit)
      .then(parser.parseJobs)
      .then(jobs => {
        if (this.includeDescription) {
          return Promise.all(jobs.map(j => this.getJob(j.id)));
        }
        return jobs;
      });
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return rp(
      `https://api.smartrecruiters.com/v1/companies/${this.boardName}/postings/${id}`
    ).then(parser.parseJob);
  }
}

module.exports = Client;
