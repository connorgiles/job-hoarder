import axios from 'axios';

import CollageParser from './parser';

type CollageParams = {
  companyId: string;
};

export default class Greenhouse implements JobClient {
  private companyId: string;
  private parser: CollageParser;

  constructor(params?: string | CollageParams) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }

    if (!params || !params.companyId) throw new Error('Client must have a company Id');
    this.companyId = params.companyId;
    this.parser = new CollageParser();
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs() {
    return axios
      .get(`https://api.collage.co/v1/positions/${this.companyId}`)
      .then((res) => res.data)
      .then(this.parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id: string) {
    return this.getJobs().then((jobs) => {
      const job = jobs.find((j) => j.id === id);

      if (!job) {
        throw new Error('Could not find job with given id ' + id);
      }

      return job;
    });
  }
}
