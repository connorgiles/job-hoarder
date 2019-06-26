module.exports = function setupParser(boardName) {
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
      url: `https://${boardName}.applytojob.com/apply/${job.board_code}`,
      title: job.title,
      datePosted: new Date(job.original_open_date),
      jobLocation: `${job.city}, ${job.state}, ${job.country_id}`,
      department: job.department,
      description: job.description
    };
    return job;
  }

  /**
   * Parses applications from request result
   * @param {string} data String of application results
   * @returns {array} List of applications
   */
  function parseApplications(data) {
    if (!data) throw new Error('No applications to parse');
    let applications = typeof data === 'object' ? data : JSON.parse(data);
    applications = applications.map(a => ({
      id: a.id,
      jobId: a.job_id,
      jobTitle: a.job_title,
      firstName: a.first_name,
      lastName: a.last_name,
      phone: a.prospect_phone,
      dateApplied: new Date(a.apply_date)
    }));
    return applications;
  }

  return {
    parseJobs,
    parseJob,
    parseApplications
  };
};
