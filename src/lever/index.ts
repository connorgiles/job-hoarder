import LeverParser from './parser';
import axios from 'axios';

type LeverParams = {
  companyId: string;
};

export default class Lever implements JobClient {
  private companyId: string;
  private parser: LeverParser;

  constructor(params?: string | LeverParams) {
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
    this.parser = new LeverParser();
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs() {
    return axios
      .get(`https://api.lever.co/v0/postings/${this.companyId}?mode=json`)
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
      .get(`https://api.lever.co/v0/postings/${this.companyId}/${id}`)
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}
