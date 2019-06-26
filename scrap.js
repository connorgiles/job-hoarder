const JobHoarder = require('./index');

(async () => {
  try {
    const vidyard = new JobHoarder.Greenhouse('vidyard');

    const jobs = await vidyard.getJobs();
    console.log(JSON.stringify(jobs, null, 2));

    const job = await vidyard.getJob('1735278');
    console.log(JSON.stringify(job, null, 2));

  } catch (error) {
    console.error(error);
  }

  try {
    const wealthsimple = new JobHoarder.Lever('wealthsimple');

    const jobs = await wealthsimple.getJobs();
    console.log(JSON.stringify(jobs, null, 2));

    const job = await wealthsimple.getJob('9a112f05-1fee-4f63-bddf-69d9cdde570f');
    console.log(JSON.stringify(job, null, 2));

  } catch (error) {
    console.error(error);
  }
})();
