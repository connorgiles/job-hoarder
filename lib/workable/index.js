const setupParser = require('./parser');
const rp = require('request-promise');

class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params
      };
    }

    if (!params || !params.companyId)
      throw new Error('Client must have a company Id');

    this.companyId = params.companyId;
    this.parser = setupParser(params.companyId);
  }

  _queryAll({ uri, query }) {
    return new Promise(async (resolve, reject) => {
      let totalResults = null;
      let token = null;

      const getSomeJobs = token => {
        const body = {
          query,
          location: [],
          department: [],
          worktype: [],
          remote: []
        };
        if (token) body.token = token;

        return rp({
          uri,
          method: 'POST',
          body,
          json: true
        });
      };

      try {
        while (totalResults === null || token != null) {
          let { results, nextPage } = await getSomeJobs(token);
          token = nextPage;
          if (!results) resolve(totalResults);
          if (!totalResults) totalResults = [];
          totalResults = totalResults.concat(results);
        }
      } catch (error) {
        reject(error);
      }
      resolve(totalResults);
    });
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs(query = '') {
    return this._queryAll({
      uri: `https://careers-page.workable.com/api/v1/accounts/${this.companyId}/jobs`,
      query
    }).then(this.parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return rp(
      `https://careers-page.workable.com/api/v1/accounts/${this.companyId}/jobs/${id}`
    ).then(this.parser.parseJob);
  }
}

module.exports = Client;
