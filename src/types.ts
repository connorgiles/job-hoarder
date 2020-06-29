declare type Job = {
  id?: string;
  url?: string;
  title?: string;
  datePosted?: Date;
  jobLocation?: string;
  department?: string;
  description?: string;
};

declare interface ClientParser {
  parseJobs(data?: any): Job[];
  parseJob(data?: any): Job;
}

declare interface JobClient {
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job>;
}
