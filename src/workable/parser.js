import { ensureJSON } from '../utils';

module.exports = setupParser = (boardName) => {
  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  const parseJobs = (data) => {
    if (!data) throw new Error('No jobs to parse');
    const jobs = ensureJSON(data);
    if (!jobs) throw new Error('Failed to parse jobs');
    return jobs.map(parseJob);
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  const parseJob = (data) => {
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
    } = ensureJSON(data);

    const url = `https://apply.workable.com/${boardName}/j/${shortcode}/`;

    const jobLocation = [city, region, country].filter((val) => val).join(', ');

    return {
      id,
      url,
      title,
      datePosted: new Date(published),
      jobLocation: jobLocation,
      department,
      description: `${description}<br/>${benefits}`,
    };
  };

  return {
    parseJobs,
    parseJob,
  };
};
