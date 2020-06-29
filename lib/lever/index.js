import parser from './parser';
import axios from 'axios';

class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
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
    return axios
      .get(`https://api.lever.co/v0/postings/${this.companyId}?mode=json`)
      .then((res) => res.data)
      .then(parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return axios
      .get(`https://api.lever.co/v0/postings/${this.companyId}/${id}`)
      .then((res) => res.data)
      .then(parser.parseJob);
  }
}

module.exports = Client;
