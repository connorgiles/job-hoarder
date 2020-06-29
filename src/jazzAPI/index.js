import setupParser from './parser';
import axios from 'axios';

const MAX_PAGE_RESULTS = 100;
class Client {
  constructor({ companyId, apiKey, status = 'open' }) {
    if (!companyId || !apiKey) throw new Error('Invalid params to instantiate');
    this.apiKey = apiKey;
    this.status = status;
    this.parser = setupParser(companyId);
  }

  async _queryAll(url) {
    let page = 1;
    let totalResults = [];
    let result = [];

    while (page === 1 || result.length === MAX_PAGE_RESULTS) {
      result = await axios
        .get(`${url}/page/${page}?apikey=${this.apiKey}`)
        .then((res) => res.data);
      if (!result) return totalResults;
      totalResults = totalResults.concat(result);
      page++;
    }

    return totalResults;
  }

  /**
   * Gets jobs from job board
   * @param {string} status Status to filter to (optional)
   * @returns {array} List of jobs
   */
  getJobs({ status = this.status } = {}) {
    return this._queryAll(
      `https://api.resumatorapi.com/v1/jobs${status ? '/status/' + status : ''}`
    ).then(this.parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return axios
      .get(`https://api.resumatorapi.com/v1/jobs/${id}?apikey=${this.apiKey}`)
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }

  /**
   * Gets job applicants from job board
   * @param {string} jobId Id of job to retrieve applications from
   * @returns {array} Applicants to the job
   */
  getApplications(jobId) {
    return this._queryAll(
      `https://api.resumatorapi.com/v1/applicants/job_id/${jobId}`
    ).then(this.parser.parseApplications);
  }
}

module.exports = Client;
