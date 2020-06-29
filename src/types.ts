export type Job = {
  id?: string;
  url?: string;
  title?: string;
  datePosted?: Date;
  jobLocation?: string;
  department?: string;
  description?: string;
};

export interface ClientParser {
  parseJobs(data?: any): Job[];
  parseJob(data?: any): Job;
}

export interface JobClient {
  getJobs(): Promise<Job[]>;
  getJob(id: string): Promise<Job>;
}
