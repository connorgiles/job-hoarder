const setupParser = require('./parser');
const rp = require('request-promise');

const MAX_PAGE_RESULTS = 100;

let parser;

class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params
      };
    }

    if (!params || !params.companyId) throw new Error('Invalid params to instantiate');
    this.boardName = params.companyId;
    parser = setupParser(params.companyId);
  }

  _queryAll(url) {
    return new Promise(async (resolve, reject) => {
      let page = 0;
      let totalResults = [];
      let result = [];
      try {
        while (page === 0 || result.length === MAX_PAGE_RESULTS) {
          result = await rp(`${url}?limit=${MAX_PAGE_RESULTS}&offset=${MAX_PAGE_RESULTS*page}`).then(JSON.parse);
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
  };

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is false
   * @returns {array} List of jobs
   */
  getJobs(enrich = false) {
    return this._queryAll(`https://api.smartrecruiters.com/v1/companies/${this.boardName}/postings`)
      .then(parser.parseJobs)
      .then(jobs => {
        if (enrich) {
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
    return rp(`https://api.smartrecruiters.com/v1/companies/${this.boardName}/postings/${id}`).then(parser.parseJob);
  }

}

module.exports = Client;
