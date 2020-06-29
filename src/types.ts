type Job = {
  id: String;
  url: String;
  title: String;
  datePosted: Date;
  jobLocation: String;
  department: String;
  description: String;
};

interface ClientParser {
  parseJobs(data?: any): Array<Job>;
  parseJob(data?: any): Job;
}

interface JobClient {
  getJobs(): Promise<Array<Job>>;
  getJob(id: string): Promise<Job>;
}
