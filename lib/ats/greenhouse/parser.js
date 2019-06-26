/**
 * Parse jobs from request result
 * @param {string} jobs String of jobs
 * @returns {array} List of parsed jobs
 */
const parseJobs = (jobs) => {
  return JSON.parse(jobs);
};

/**
 * Parses job from request result
 * @param {string} job String of job result
 * @returns {object} Object of parsed job
 */
const parseJob = (job) => {
  return JSON.parse(job);
};

module.exports = {
  parseJobs,
  parseJob
};
