const parser = require('./parser');
const axios = require('axios');

class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }
    // Check for params
    if (!params || !params.companyId)
      throw new Error('Client must have a company Id');

    this.companyId = params.companyId;
    this.enrich = params.enrich || false;
    this.parser = parser;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs({ enrich = this.enrich } = {}) {
    return axios
      .get(`https://${this.companyId}.applytojob.com/apply`)
      .then((res) => res.data)
      .then(this.parser.parseJobs)
      .then((jobs) => {
        if (enrich) {
          return Promise.all(jobs.map((j) => this.getJob(j.id)));
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
    return axios
      .get(`https://${this.companyId}.applytojob.com/apply/${id}`)
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}

module.exports = Client;
