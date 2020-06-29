import JazzScrapeParser from './parser';
import axios from 'axios';

type JazzScrapeParams = {
  companyId?: string;
  enrich?: boolean;
};

export default class JazzScrape implements JobClient {
  private parser: JazzScrapeParser;
  private enrich: boolean;
  private companyId: string;

  constructor(params?: string | JazzScrapeParams) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }
    // Check for params
    if (!params || !params.companyId)
      throw new Error('Client must have a company Id');

    this.companyId = params.companyId;
    this.enrich = params.enrich || false;
    this.parser = new JazzScrapeParser();
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs({ enrich = this.enrich }: JazzScrapeParams = {}) {
    return axios
      .get(`https://${this.companyId}.applytojob.com/apply`)
      .then((res) => res.data)
      .then(this.parser.parseJobs)
      .then((jobs) => {
        if (enrich) {
          return Promise.all(jobs.map((j: any) => this.getJob(j.id)));
        }
        return jobs;
      });
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id: string) {
    return axios
      .get(`https://${this.companyId}.applytojob.com/apply/${id}`)
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}
