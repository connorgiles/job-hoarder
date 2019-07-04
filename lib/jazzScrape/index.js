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

    if (!params || !params.companyId) throw new Error('Client must have a company Id');
    this.companyId = params.companyId;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs(enrich = false) {
    return rp(`https://${this.companyId}.applytojob.com/apply`)
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
    return rp(`https://${this.companyId}.applytojob.com/apply/${id}`).then(parser.parseJob);
  }

}

module.exports = Client;
