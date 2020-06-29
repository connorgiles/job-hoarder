import setupParser from './parser';
import axios from 'axios';

const MAX_PAGE_RESULTS = 100;
class Client {
  constructor(params) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }

    if (!params || !params.companyId)
      throw new Error('Invalid params to instantiate');
    this.boardName = params.companyId;
    this.enrich = params.enrich || false;
    this.parser = setupParser(params.companyId);
  }

  _queryAll(baseUrl) {
    return new Promise(async (resolve, reject) => {
      let page = 0;
      let totalResults = [];
      let result = [];

      try {
        // Loop until no more results
        while (page === 0 || result.length === MAX_PAGE_RESULTS) {
          const offset = MAX_PAGE_RESULTS * page;
          const url = `${baseUrl}?limit=${MAX_PAGE_RESULTS}&offset=${offset}`;
          result = await axios
            .get(url)
            .then((res) => res.data)
            .then((r) => r.content);
          if (!result) resolve(totalResults);
          totalResults = totalResults.concat(result);
          page++;
        }

        // Resolve results
        resolve(totalResults);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is same as client
   * @returns {array} List of jobs
   */
  getJobs({ enrich = this.enrich } = {}) {
    return this._queryAll(
      `https://api.smartrecruiters.com/v1/companies/${this.boardName}/postings`
    ).then((jobs) => {
      if (enrich) {
        return Promise.all(jobs.map((j) => this.getJob(j.id)));
      }
      return this.parser.parseJobs(jobs);
    });
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    return axios
      .get(
        `https://api.smartrecruiters.com/v1/companies/${this.boardName}/postings/${id}`
      )
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}

module.exports = Client;