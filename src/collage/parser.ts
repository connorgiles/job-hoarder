import decode from 'lodash.unescape';

import { ensureJSON } from '../utils';

type CollageJob = {
  id: number;
  title: string;
  locale: string;
  location: string;
  commitment: string;
  department: string;
  description: string;
  descriptionPlain: string;
  createdDate: string;
  hostedUrl: string;
  applyUrl: string;
};

type CollageJobList = {
  positions: CollageJob[];
};

export default class CollageParser implements ClientParser {
  /**
   * Parse jobs from request result
   * @param {any} data String of jobs
   * @returns {Job[]} List of parsed jobs
   */
  public parseJobs = (data?: any) => {
    if (!data) throw new Error('No jobs to parse');
    const jobs = ensureJSON(data) as CollageJobList;
    if (!jobs.positions) throw new Error('Failed to parse jobs');
    return jobs.positions.map((j) => this.parseJob(j));
  };

  /**
   * Parses job from request result
   * @param {any} data String of job result
   * @returns {Job} Object of parsed job
   */
  public parseJob = (data?: any) => {
    if (!data) throw new Error('No job to parse');
    const job = ensureJSON(data) as CollageJob;
    return {
      id: job.id.toString(),
      url: job.hostedUrl,
      title: job.title,
      datePosted: new Date(job.createdDate),
      jobLocation: job.location,
      department: job.department,
      description: job.description,
    };
  };
}
