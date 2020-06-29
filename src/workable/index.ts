import WorkableParser from './parser';
import axios from 'axios';

type WorkableParams = {
  companyId?: string;
  query?: string;
};

type WorkablePageResponse = {
  results: object[];
  nextPage: string;
};

export default class Workable implements JobClient {
  private parser: WorkableParser;
  private companyId: string;
  private query?: string;

  constructor(params?: string | WorkableParams) {
    // Allow string paramater to resolve
    if (typeof params === 'string') {
      params = {
        companyId: params,
      };
    }

    if (!params || !params.companyId) throw new Error('Client must have a company Id');

    this.companyId = params.companyId;
    this.query = params.query || '';
    this.parser = new WorkableParser(params.companyId);
  }

  private async queryAll(uri: string, query: string | undefined) {
    let totalResults: object[] | undefined;
    let token: string | undefined;

    const getSomeJobs = (t: string): Promise<WorkablePageResponse> => {
      const body = {
        query,
        location: [],
        department: [],
        worktype: [],
        remote: [],
        token: t || undefined,
      };
      return axios.post(uri, body).then((res) => res.data);
    };

    while (totalResults === undefined || token) {
      const { results, nextPage } = (await getSomeJobs(token as string)) as WorkablePageResponse;
      token = nextPage;
      if (!totalResults) totalResults = [];
      if (!results) return totalResults;
      totalResults = totalResults.concat(results);
    }
    return totalResults;
  }

  /**
   * Gets jobs from job board
   * @returns {array} List of jobs
   */
  getJobs({ query = this.query }: WorkableParams = {}) {
    return this.queryAll(`https://careers-page.workable.com/api/v1/accounts/${this.companyId}/jobs`, query).then(
      this.parser.parseJobs,
    );
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id: string) {
    return axios
      .get(`https://careers-page.workable.com/api/v1/accounts/${this.companyId}/jobs/${id}`)
      .then((res) => res.data)
      .then(this.parser.parseJob);
  }
}
