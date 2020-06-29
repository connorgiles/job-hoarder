import setupParser from './parser';
import axios from 'axios';

const cityNameForWeb = (city) => {
  return city.replace(' ', '+').replace(',', '%2C');
};

class Indeed {
  constructor({
    host,
    query = '',
    city = '',
    radius = '25',
    level = '',
    maxAge = '',
    sort = '',
    jobType = '',
    excludeSponsored = false,
    excludeAgencies = false,
    includeDescription = true,
    limit = 0,
    start = 0,
  }) {
    if (!host) throw new Error('Missing host');
    this.host = host;
    this.query = query;
    this.city = city;
    this.radius = radius;
    this.level = level;
    this.maxAge = maxAge;
    this.sort = sort;
    this.jobType = jobType;
    this.excludeAgencies = excludeAgencies;
    this.excludeSponsored = excludeSponsored;
    this.includeDescription = includeDescription;
    this.limit = limit;
    this.start = start;

    this.parser = setupParser(this.host, this.excludeSponsored);
  }

  _buildUrl({ start }) {
    let q = 'https://' + this.host + '/jobs';
    q += '?q=' + this.query;
    q += '&l=' + cityNameForWeb(this.city);
    q += '&radius=' + this.radius;
    q += '&explvl=' + this.level;
    q += '&fromage=' + this.maxAge;
    q += '&sort=' + this.sort;
    q += '&jt=' + this.jobType;
    q += '&start=' + start;
    if (this.excludeAgencies) q += '&sr=directhire';
    return encodeURI(q);
  }

  _buildDescriptionsUrl(jobIds) {
    return `https://${this.host}/rpc/jobdescs?jks=${encodeURIComponent(
      jobIds.join(',')
    )}`;
  }

  /**
   * Gets jobs from job board
   * @param {boolean} enrich Enriches job listing with details (optional) Default is false
   * @returns {array} List of jobs
   */
  getJobs({
    start: _start = this.start,
    limit: _limit = this.limit,
    includeDescription = this.includeDescription,
  } = {}) {
    let start = Number(_start);
    const limit = Number(_limit);
    const idHash = {};

    // Recursive function to get jobs until limit
    const getSomeJobs = async (jobs = []) => {
      const url = this._buildUrl({ start });
      const body = await axios.get(url).then((res) => res.data);
      const parsed = this.parser.parseJobs(body);

      // Make sure to not repeat
      parsed.jobs = parsed.jobs.filter((j) => {
        if (!idHash[j.id]) {
          idHash[j.id] = true;
          return true;
        }
        return false;
      });

      if (parsed.jobs.length === 0) return jobs;

      if (includeDescription) {
        // Enrich with Job Descriptions
        const jobIds = parsed.jobs.map((j) => j.id);
        const descriptionUrl = this._buildDescriptionsUrl(jobIds);
        const descriptions = await axios
          .get(descriptionUrl)
          .then((res) => res.data);
        parsed.jobs = parsed.jobs.map((j) => ({
          ...j,
          description: descriptions[j.id],
        }));
      }

      jobs = jobs.concat(parsed.jobs);

      // Check exit cases
      if (parsed.continue !== true) return jobs;
      // If we reach the limit stop looping
      if (limit != 0 && jobs.length > limit) {
        while (jobs.length != limit) jobs.pop();
        return jobs;
      }

      // Continue getting more jobs
      start += 10;
      return getSomeJobs(jobs);
    };

    return getSomeJobs();
  }

  /**
   * Gets job details from job board
   * @param {string} id Id of job to retrieve
   * @returns {object} Job assigned to Id
   */
  getJob(id) {
    throw new Error('Function not implemented: Indeed.getJob');
  }
}

module.exports = Indeed;
