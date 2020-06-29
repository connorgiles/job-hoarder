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
  departments: GreenhouseRelated[];
};

type GreenhouseJobList = {
  jobs: GreenhouseJob[];
};

export default class GreehouseParser implements ClientParser {
  /**
   * Parse jobs from request result
   * @param {any} data String of jobs
   * @returns {Job[]} List of parsed jobs
   */
  public parseJobs = (data?: any) => {
    if (!data) throw new Error('No jobs to parse');
    const jobs = ensureJSON(data) as GreenhouseJobList;
    if (!jobs.jobs) throw new Error('Failed to parse jobs');
    return jobs.jobs.map((j) => this.parseJob(j));
  };

  /**
   * Parses job from request result
   * @param {any} data String of job result
   * @returns {Job} Object of parsed job
   */
  public parseJob = (data?: any) => {
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
  };
}
