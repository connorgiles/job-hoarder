module.exports = function setupParser(boardName) {
  /**
   * Build description from smartrecruiter job
   * @param {object} job Job to build description from
   * @returns {string} Job description
   */
  function parseDescription(jobAd) {
    let description = '';
    for (let section in jobAd.sections) {
      const l = jobAd.sections[section];
      description += `<h3>${l.title}</h3>`;
      description += l.text;
    }
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
      url: job.applyUrl ? job.applyUrl : `https://jobs.smartrecruiters.com/${boardName}/${job.id}`,
      title: job.name,
      datePosted: job.releasedDate ? new Date(job.releasedDate) : null,
      language: job.language && job.language.code ? job.language.code : null,
      jobLocation: `${
      job.location.city
    }, ${
      job.location.region
    }, ${
      job.location.country.toUpperCase()
    }`,
      department: job.department && job.department.label ? job.department.label : null,
      description: job.jobAd ? parseDescription(job.jobAd) : null
    };

    return job;
  }

  return {
    parseJobs,
    parseJob
  };
}
