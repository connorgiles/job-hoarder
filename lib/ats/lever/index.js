const parser = require('./parser');

class Client {
  constructor(companyId) {
    if (!companyId) throw new Error('Client must have a company Id');
    this.companyId = companyId;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  async getJobs() {

  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  async getJob(id) {

  }

}

module.exports = Client;
