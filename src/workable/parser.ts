import { ensureJSON } from '../utils';

type WorkableJob = {
  id: string;
  title: string;
  shortcode: string;
  benefits: string;
  description: string;
  department: string;
  updated_at: Date;
  content: string;
  published: string;
  location: {
    city: string;
    region: string;
    country: string;
  };
};

export default class WorkableParser implements ClientParser {
  private boardName: string;

  constructor(boardName: string) {
    this.boardName = boardName;
  }

  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  parseJobs = (data?: any): Job[] => {
    if (!data) throw new Error('No jobs to parse');
    const jobs = ensureJSON(data) as WorkableJob[];
    if (!jobs) throw new Error('Failed to parse jobs');
    return jobs.map(this.parseJob);
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  parseJob = (data?: any): Job => {
    if (!data) throw new Error('No job to parse');
    const {
      id,
      shortcode,
      title,
      description,
      benefits,
      department,
      location: { city, region, country },
      published,
    } = ensureJSON(data) as WorkableJob;

    const url = `https://apply.workable.com/${this.boardName}/j/${shortcode}/`;

    const jobLocation = [city, region, country].filter((val) => val).join(', ');

    return {
      id,
      url,
      title,
      datePosted: new Date(published),
      jobLocation,
      department,
      description: `${description}<br/>${benefits}`,
    };
  };
}
