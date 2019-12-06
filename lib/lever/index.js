const parser = require('./parser');
const rp = require('request-promise');

class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params
      };
    }
    // Check valid params
    if (!params || !params.companyId)
      throw new Error('Client must have a company Id');

    this.companyId = params.companyId;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs() {
    return rp(
      `https://api.lever.co/v0/postings/${this.companyId}?mode=json`
    ).then(parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return rp(`https://api.lever.co/v0/postings/${this.companyId}/${id}`).then(
      parser.parseJob
    );
  }
}

module.exports = Client;
