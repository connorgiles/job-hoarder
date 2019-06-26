const decode = require('unescape');

/**
 * Parse jobs from request result
 * @param {string} data String of jobs
 * @returns {array} List of parsed jobs
 */
function parseJobs(data) {
  if (!data) throw new Error('No jobs to parse');
  let jobs = typeof data === 'object' ? data : JSON.parse(data);
  if (!jobs.jobs) throw new Error('Failed to parse jobs');
  jobs = jobs.jobs.map(parseJob);
  return jobs;
}

/**
 * Parses job from request result
 * @param {string} data String of job result
 * @returns {object} Object of parsed job
 */
function parseJob(data) {
  if (!data) throw new Error('No job to parse');
  let job = typeof data === 'object' ? data : JSON.parse(data);
  job = {
    id: job.id.toString(),
    url: job.absolute_url,
    title: job.title,
    datePosted: new Date(job.updated_at),
    jobLocation: job.location.name,
    department: job.departments.map(d => d.name).join(', '),
    description: decode(job.content)
  };
  return job;
}

module.exports = {
  parseJobs,
  parseJob
};
