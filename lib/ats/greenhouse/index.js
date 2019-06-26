const parser = require('./parser');
const rp = require('request-promise');

class Client {
  constructor(companyId) {
    if (!companyId) throw new Error('Client must have a company Id');
    this.companyId = companyId;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs() {
    return rp(`https://boards-api.greenhouse.io/v1/boards/${this.companyId}/jobs?content=true`).then(parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return rp(`https://boards-api.greenhouse.io/v1/boards/${this.companyId}/jobs/${id}`).then(parser.parseJob);
  }

}

module.exports = Client;
