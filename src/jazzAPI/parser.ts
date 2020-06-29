import { ensureJSON } from '../utils';

type JazzAPIJob = {
  id: string;
  title: string;
  board_code: string;
  original_open_date: string;
  city: string;
  state: string;
  country_id: string;
  description: string;
  department: string;
};

type JazzAPIApplication = {
  id: string;
  job_id: string;
  job_title: string;
  first_name: string;
  last_name: string;
  prospect_phone: string;
  apply_date: string;
};

export default class JazzAPIParser implements ClientParser {
  private boardName: string;

  constructor(boardName: string) {
    this.boardName = boardName;
  }
  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  public parseJobs = (data?: any): Array<Job> => {
    if (!data) throw new Error('No jobs to parse');
    let jobs = ensureJSON(data) as Array<JazzAPIJob>;
    return jobs.map(this.parseJob);
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  public parseJob = (data?: any): Job => {
    if (!data) throw new Error('No job to parse');
    let job = ensureJSON(data) as JazzAPIJob;
    return {
      id: job.id,
      url: `https://${this.boardName}.applytojob.com/apply/${job.board_code}`,
      title: job.title,
      datePosted: new Date(job.original_open_date),
      jobLocation: `${job.city}, ${job.state}, ${job.country_id}`,
      department: job.department,
      description: job.description,
    };
  };

  /**
   * Parses applications from request result
   * @param {string} data String of application results
   * @returns {array} List of applications
   */
  public parseApplications = (data?: any): Array<JazzAPIApplication> => {
    if (!data) throw new Error('No applications to parse');
    return ensureJSON(data) as Array<JazzAPIApplication>;
  };
}
