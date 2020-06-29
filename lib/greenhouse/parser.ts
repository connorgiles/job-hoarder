import decode from 'lodash.unescape';
import { ensureJSON } from '../utils';

type GreenhouseRelated = {
  name: string;
};

type GreenhouseJob = {
  id: number;
  absolute_url: string;
  title: string;
  updated_at: Date;
  location: GreenhouseRelated;
  content: string;
  departments: Array<GreenhouseRelated>;
};

type GreenhouseJobList = {
  jobs: Array<GreenhouseJob>;
};

export default class GreehouseParser implements ClientParser {
  /**
   * Parse jobs from request result
   * @param {any} data String of jobs
   * @returns {Array<Job>} List of parsed jobs
   */
  parseJobs(data: GreenhouseJobList) {
    if (!data) throw new Error('No jobs to parse');
    const jobs = ensureJSON(data) as GreenhouseJobList;
    if (!jobs.jobs) throw new Error('Failed to parse jobs');
    const parse = this.parseJob.bind(this);
    return jobs.jobs.map(parse);
  }

  /**
   * Parses job from request result
   * @param {any} data String of job result
   * @returns {Job} Object of parsed job
   */
  parseJob(data: GreenhouseJob) {
    if (!data) throw new Error('No job to parse');
    const job = ensureJSON(data) as GreenhouseJob;
    return {
      id: job.id.toString(),
      url: job.absolute_url,
      title: job.title,
      datePosted: new Date(job.updated_at),
      jobLocation: job.location.name,
      department: job.departments.map((d) => d.name).join(', '),
      description: decode(job.content),
    };
  }
}
