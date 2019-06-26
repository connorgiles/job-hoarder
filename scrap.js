const JobHoarder = require('./index');

const vidyard = new JobHoarder.Greenhouse('vidyard');


(async () => {
  try {
    const jobs = await vidyard.getJobs();
    console.log(JSON.stringify(jobs, null, 2));

    const job = await vidyard.getJob('1735278');
    console.log(JSON.stringify(job, null, 2));

  } catch (error) {
    console.error(error);
  }
})();
