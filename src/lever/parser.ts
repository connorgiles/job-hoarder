import { ensureJSON } from '../utils';

type LeverJob = {
  id: string;
  text: string;
  hostedUrl: string;
  createdAt: Date;
  categories: { location: string; department: string; team: string };
  description: string;
  lists: LeverDescriptionList[];
  additional: string;
};

type LeverDescriptionList = {
  text: string;
  content: string;
};

type LeverDescriptionParams = {
  desc: string;
  lists: LeverDescriptionList[];
  additional: string;
};

export default class LeverParser implements ClientParser {
  /**
   * Build description from lever job
   * @param {object} job Job to build description from
   * @returns {string} Job description
   */
  private parseDescription = ({ desc, lists, additional }: LeverDescriptionParams): string => {
    let description = '';
    description += desc;
    lists.forEach((l) => {
      description += `<h3>${l.text}</h3>`;
      description += `<ul>${l.content}</ul>`;
    });
    description += additional;
    return description;
  };

  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  public parseJobs = (data?: any) => {
    if (!data) throw new Error('No jobs to parse');
    const jobs = ensureJSON(data) as LeverJob[];
    return jobs.map(this.parseJob);
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  public parseJob = (data?: any) => {
    if (!data) throw new Error('No job to parse');
    data = ensureJSON(data) as LeverJob;

    const {
      id,
      text: title,
      hostedUrl: url,
      createdAt,
      categories: { location: jobLocation, department: dep, team },
      description: desc,
      lists,
      additional,
    } = data;

    const datePosted = new Date(createdAt);
    const department = [dep, team].filter((a) => a).join(' - ');
    const description = this.parseDescription({
      desc,
      lists,
      additional,
    });

    return {
      id,
      url,
      title,
      jobLocation,
      datePosted,
      department,
      description,
    };
  };
}
