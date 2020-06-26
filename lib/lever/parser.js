const { ensureJSON } = require('../utils');

/**
 * Build description from lever job
 * @param {object} job Job to build description from
 * @returns {string} Job description
 */
const parseDescription = ({ desc, lists, additional }) => {
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
  data = ensureJSON(data);

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
  const description = parseDescription({
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

module.exports = {
  parseJobs,
  parseJob,
};
