import GreehouseParser from './parser';
import axios from 'axios';

type GreehouseParams = {
  companyId: string;
};

export default class Greenhouse implements JobClient {
  private companyId: string;
  private parser: GreehouseParser;

  constructor(params: string | GreehouseParams) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }

    if (!params || !params.companyId)
      throw new Error('Client must have a company Id');
    this.companyId = params.companyId;
    this.parser = new GreehouseParser();
    console.log(GreehouseParser);
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs() {
    return axios
      .get(
        `https://boards-api.greenhouse.io/v1/boards/${this.companyId}/jobs?content=true`
      )
      .then((res) => res.data)
      .then(this.parser.parseJobs);
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id: string) {
    return axios
      .get(
        `https://boards-api.greenhouse.io/v1/boards/${this.companyId}/jobs/${id}`
      )
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}
