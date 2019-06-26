const decode = require('unescape');

/**
 * Parse jobs from request result
 * @param {string} data String of jobs
 * @returns {array} List of parsed jobs
 */
const parseJobs = (data) => {
  if (!data) throw new Error('No jobs to parse');
  let jobs = typeof data === 'object' ? data : JSON.parse(data);
  if (!jobs.jobs) throw new Error('Failed to parse jobs');
  jobs = jobs.jobs.map(parseJob);
  return jobs;
};

/**
 * Parses job from request result
 * @param {string} data String of job result
 * @returns {object} Object of parsed job
 */
const parseJob = (data) => {
  if (!data) throw new Error('No job to parse');
  let job = typeof data === 'object' ? data : JSON.parse(data);
  job = {
    id: job.id,
    url: job.absolute_url,
    title: job.title,
    datePosted: Date.parse(job.updated_at),
    jobLocation: job.location.name,
    department: !job.departments ? null : job.departments.map(d => d.name).join(', '),
    offices: !job.offices ? null : job.offices.map(o => ({
      name: o.name,
      location: o.location
    })),
    description: decode(job.content)
  }
  return job;
};

module.exports = {
  parseJobs,
  parseJob
};
