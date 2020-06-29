type Job = {
  id?: string;
  url?: string;
  title?: string;
  datePosted?: Date;
  jobLocation?: string;
  department?: string;
  description?: string;
};

interface PublicJob extends Job {
  company?: string;
  companyUrl: string;
  salary: string;
}

interface ClientParser {
  parseJobs(data?: any): Array<Job>;
  parseJob(data?: any): Job;
}

interface JobClient {
  getJobs(): Promise<Array<Job>>;
  getJob(id: string): Promise<Job>;
}
