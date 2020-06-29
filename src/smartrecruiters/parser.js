import { ensureJSON } from '../utils';

module.exports = (boardName) => {
  /**
   * Build description from smartrecruiter job
   * @param {object} job Job to build description from
   * @returns {string} Job description
   */
  const parseDescription = (jobAd) => {
    if (!jobAd) return null;
    let description = '';
    for (let section in jobAd.sections) {
      const l = jobAd.sections[section];
      description += `<h3>${l.title}</h3>`;
      description += l.text;
    }
    return description;
  };

  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  const parseJobs = (data) => {
    if (!data) throw new Error('No jobs to parse');
    let jobs = ensureJSON(data);
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
      applyUrl,
      name: title,
      releasedDate = null,
      language: { code: language = null } = {},
      location: { city, region, country } = {},
      department: { label: department = null } = {},
      jobAd,
    } = ensureJSON(data);

    const url = applyUrl
      ? applyUrl
      : `https://jobs.smartrecruiters.com/${boardName}/${id}`;

    const datePosted = releasedDate ? new Date(releasedDate) : null;

    const jobLocation = `${city}, ${region}, ${country.toUpperCase()}`;

    const description = parseDescription(jobAd);

    return {
      id,
      url,
      title,
      datePosted,
      language,
      jobLocation,
      department,
      description,
    };
  };

  return {
    parseJobs,
    parseJob,
  };
};
