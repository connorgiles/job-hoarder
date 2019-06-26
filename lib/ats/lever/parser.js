/**
 * Build description from lever job
 * @param {object} job Job to build description from
 * @returns {string} Job description
 */
function parseDescription(job) {
  let description = '';
  description += job.description;
  job.lists.forEach(l => {
    description += `<h3>${l.text}</h3>`;
    description += `<ul>${l.content}</ul>`;
  });
  description += job.additional;
  return description;
}

/**
 * Parse jobs from request result
 * @param {string} data String of jobs
 * @returns {array} List of parsed jobs
 */
function parseJobs(data) {
  if (!data) throw new Error('No jobs to parse');
  let jobs = typeof data === 'object' ? data : JSON.parse(data);
  jobs = jobs.map(parseJob);
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
    id: job.id,
    url: job.hostedUrl,
    title: job.text,
    datePosted: job.createdAt,
    jobLocation: job.categories.location,
    department: job.categories.department + ' - ' + job.categories.team,
    description: parseDescription(job)
  };
  return job;
}

module.exports = {
  parseJobs,
  parseJob
};
