export type JobDetailsType ={
  job_description: string;
  job_type: string;
  job_details: string[];
  job_time: string;
  job_link: string;
}
export type JobDataType ={
  job_title: string;
  company_description: string;
  company_size: string;
  additional_details: JobDetailsType[];
}
