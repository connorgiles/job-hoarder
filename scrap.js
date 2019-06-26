const JobHoarder = require('./index');

const vidyard = new JobHoarder.Greenhouse('vidyard');


(async () => {
  try {

    const jobs = await vidyard.getJobs();
    console.log(jobs);

    const job = await vidyard.getJob('1735278');
    console.log(job);

  } catch (error) {
    console.error(error);
  }
})();
