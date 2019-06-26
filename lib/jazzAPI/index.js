const setupParser = require('./parser');
const rp = require('request-promise');

const MAX_PAGE_RESULTS = 100;

let parser;

class Client {
  constructor(boardName, apiKey) {
    if (!boardName || !apiKey) throw new Error('Invalid params to instantiate');
    this.apiKey = apiKey;
    parser = setupParser(boardName);
  }

  _queryAll(url) {
    return new Promise(async (resolve, reject) => {
      let page = 1;
      let totalResults = [];
      let result = [];
      try {
        while (page === 1 || result.length === MAX_PAGE_RESULTS) {
          result = await rp(`${url}/page/${page}?apikey=${this.apiKey}`).then(JSON.parse);
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
   * @param {string} status Status to filter to (optional)
   * @returns {array} List of jobs
   */
  getJobs(status = 'open') {
    return this._queryAll(`https://api.resumatorapi.com/v1/jobs${status ? '/status/' + status : ''}`).then(parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return rp(`https://api.resumatorapi.com/v1/jobs/${id}?apikey=${this.apiKey}`).then(parser.parseJob);
  }

  /**
   * Gets job applicants from job board
   * @param {string} jobId Id of job to retrieve applications from
   * @returns {array} Applicants to the job
   */
  getApplications(jobId) {
    return this._queryAll(`https://api.resumatorapi.com/v1/applicants/job_id/${jobId}`).then(parser.parseApplications);
  }

}

module.exports = Client;
