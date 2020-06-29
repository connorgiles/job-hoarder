import setupParser from './parser';
import axios from 'axios';

class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }

    if (!params || !params.companyId)
      throw new Error('Client must have a company Id');

    this.companyId = params.companyId;
    this.query = params.query || '';
    this.parser = setupParser(params.companyId);
  }

  async _queryAll({ uri, query }) {
    let totalResults = null;
    let token = null;

    const getSomeJobs = (token) => {
      const body = {
        query,
        location: [],
        department: [],
        worktype: [],
        remote: [],
      };
      if (token) body.token = token;
      return axios.post(uri, body).then((res) => res.data);
    };

    while (totalResults === null || token != null) {
      let { results, nextPage } = await getSomeJobs(token);
      token = nextPage;
      if (!results) return totalResults;
      if (!totalResults) totalResults = [];
      totalResults = totalResults.concat(results);
    }
    return totalResults;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs({ query = this.query } = {}) {
    return this._queryAll({
      uri: `https://careers-page.workable.com/api/v1/accounts/${this.companyId}/jobs`,
      query,
    }).then(this.parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return axios
      .get(
        `https://careers-page.workable.com/api/v1/accounts/${this.companyId}/jobs/${id}`
      )
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}

module.exports = Client;
