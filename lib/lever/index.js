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
    return rp(`https://api.lever.co/v0/postings/${this.companyId}?mode=json`).then(parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return rp(`https://api.lever.co/v0/postings/${this.companyId}/${id}`).then(parser.parseJob);
  }

}

module.exports = Client;
