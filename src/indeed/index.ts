import IndeedParser from './parser';
import axios from 'axios';

const cityNameForWeb = (city: string): string => {
  return city.replace(' ', '+').replace(',', '%2C');
};

type IndeedParams = {
  host: string;
  query?: string;
  city?: string;
  radius?: string;
  level?: string;
  maxAge?: string;
  sort?: string;
  jobType?: string;
  excludeSponsored?: boolean;
  excludeAgencies?: boolean;
  includeDescription?: boolean;
  limit?: number;
  start?: number;
};

export default class Indeed implements JobClient {
  private params: IndeedParams;
  private parser: IndeedParser;

  constructor({
    host,
    query = '',
    city = '',
    radius = '25',
    level = '',
    maxAge = '',
    sort = '',
    jobType = '',
    excludeSponsored = false,
    excludeAgencies = false,
    includeDescription = true,
    limit = 0,
    start = 0,
  }: IndeedParams) {
    if (!host) throw new Error('Missing host');
    this.params = {
      host,
      query,
      city,
      radius,
      level,
      maxAge,
      sort,
      jobType,
      excludeSponsored,
      excludeAgencies,
      includeDescription,
      limit,
      start,
    };

    this.parser = new IndeedParser(host, excludeSponsored);
  }

  private buildUrl(start: number) {
    let q = 'https://' + this.params.host + '/jobs';
    q += '?q=' + this.params.query;
    q += '&l=' + cityNameForWeb(this.params.city as string);
    q += '&radius=' + this.params.radius;
    q += '&explvl=' + this.params.level;
    q += '&fromage=' + this.params.maxAge;
    q += '&sort=' + this.params.sort;
    q += '&jt=' + this.params.jobType;
    q += '&start=' + start;
    if (this.params.excludeAgencies) q += '&sr=directhire';
    return encodeURI(q);
  }

  private buildDescriptionsUrl(jobIds: Array<string>) {
    return `https://${this.params.host}/rpc/jobdescs?jks=${encodeURIComponent(
      jobIds.join(',')
    )}`;
  }

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is false
   * @returns {array} List of jobs
   */
  getJobs({
    start: _start = this.params.start,
    limit: _limit = this.params.limit,
    includeDescription = this.params.includeDescription,
  } = {}) {
    let start = Number(_start);
    const limit = Number(_limit);
    const set = new Set();

    // Recursive function to get jobs until limit
    const getSomeJobs = async (
      jobs: Array<object> = []
    ): Promise<Array<Job>> => {
      const url = this.buildUrl(start);
      const body = await axios.get(url).then((res) => res.data);
      const parsed = this.parser.parseJobs(body);

      // Make sure to not repeat
      parsed.jobs = parsed.jobs.filter((j: Job) => {
        const id = j.id as string;
        if (!set.has(id)) {
          set.add(j.id);
          return true;
        }
        return false;
      });

      if (parsed.jobs.length === 0) return jobs;

      if (includeDescription) {
        // Enrich with Job Descriptions
        const jobIds = parsed.jobs.map((j: Job) => j.id) as string[];
        const descriptionUrl = this.buildDescriptionsUrl(jobIds);
        const descriptions = await axios
          .get(descriptionUrl)
          .then((res) => res.data);

        parsed.jobs = parsed.jobs.map((j: Job) => ({
          ...j,
          description: descriptions[j.id as string],
        }));
      }

      jobs = jobs.concat(parsed.jobs);

      // Check exit cases
      if (parsed.continue !== true) return jobs;
      // If we reach the limit stop looping
      if (limit != 0 && jobs.length > limit) {
        while (jobs.length != limit) jobs.pop();
        return jobs;
      }

      // Continue getting more jobs
      start += 10;
      return getSomeJobs(jobs);
    };

    return getSomeJobs();
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id: string): Promise<Job> {
    throw new Error('Function not implemented: Indeed.getJob');
  }
}
