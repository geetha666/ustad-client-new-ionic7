export class ClientJob {
  job_id:number;
  title:string;
  status:string;
  description:string;
  job_cost:number;
  created_at:string;
  assign_date:string;
  category:string;
  client:string;
  professional:string;
  rating: any;
}

export class CancelledJobs {
  job_id:number;
  assign_date:any;
  category:any;
  client:string;
  created_at:any;
  description:string;
  job_cost:number;
  message_type:string;
  phone:number;
  professional:string;
  title:string;
  status:string;
}