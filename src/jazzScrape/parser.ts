import cheerio from 'cheerio';

import { getMatch } from '../utils';

type JazzScrapeJSONJob = {
  title: string;
  url: string;
  jobLocation: {
    address: {
      addressLocality: string;
      addressRegion: string;
    };
  };
  datePosted: string;
  description: string;
};

export default class JazzScrapeParser implements ClientParser {
  /**
   * Parse jobs from request result
   * @param {string} data String of jobs
   * @returns {array} List of parsed jobs
   */
  public parseJobs = (data?: any): Job[] => {
    if (!data) throw new Error('No jobs to parse');

    const jobs: Job[] = [];

    const $ = cheerio.load(data);
    $('.jobs-list ul li.list-group-item').each((i: number, elem: CheerioElement) => {
      const job = $(elem);

      const url = job.find('a').attr('href');
      const id = getMatch(url, /.+apply\/(.+)\/.+/);

      const title = job.find('a').text().trim();

      const jobLocation = job.find('.fa-map-marker').parent().text();

      const department = job.find('.fa-sitemap').parent().text();

      jobs.push({
        id,
        url,
        title,
        jobLocation,
        department,
      });
    });

    return jobs;
  };

  /**
   * Parsed ID from the Jazz URL
   * @param url URL to parse ID from
   */
  private parseIdFromUrl = (url: string) => getMatch(url, /.+apply\/(.+)\/.+/);

  /**
   * Parses and normalizes job based on Embedded JSON object
   * @param parsedData JSON object embedded in HTML
   * @param $ Cheerio object to extract extra features
   */
  private parseJobJSON = (parsedData: JazzScrapeJSONJob, $: CheerioStatic) => {
    const {
      title,
      url = '',
      jobLocation: { address: loc },
      datePosted: pDate,
      description,
    } = parsedData;

    const id = this.parseIdFromUrl(url);
    const datePosted = new Date(pDate);
    const jobLocation = loc ? `${loc.addressLocality}, ${loc.addressRegion}` : undefined;
    const department = $('li[title="Department"]').text().trim();

    return {
      id,
      url,
      title,
      datePosted,
      jobLocation,
      department,
      description,
    };
  };

  /**
   * Scrapes key fields from HTML
   * @param $ Cheerio object to extract features from
   */
  private parseJobHTML = ($: CheerioStatic): Job => {
    const title = $('h1:not(.brand-text)').text().trim() as string;
    const url = $('meta[property="og:url"]').attr('content') as string;
    const id = this.parseIdFromUrl(url);
    const jobLocation = $('li[title="Location"]').text().trim();
    const department = $('li[title="Department"]').text().trim();
    const description = $('div.description').first().html() as string;

    return {
      id,
      url,
      title,
      jobLocation,
      department,
      description,
    };
  };

  /**
   * Parses job from request result
   * @param {string} data String of job result
   * @returns {object} Object of parsed job
   */
  public parseJob = (data?: any): Job => {
    if (!data) throw new Error('No job to parse');
    const $ = cheerio.load(data);

    // Check to see if the page includes a JSON object
    const parsedData = JSON.parse($('script[type="application/ld+json"]').html() as string) as JazzScrapeJSONJob;
    if (parsedData && parsedData.url) return this.parseJobJSON(parsedData, $);

    // Parse HTML as fallback
    return this.parseJobHTML($);
  };
}
