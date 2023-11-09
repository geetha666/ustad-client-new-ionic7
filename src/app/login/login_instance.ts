export class User {
  id:number;
  username:string;
  password:string;
  firstname:string;
  lastname:string;
  phone:any;
  desc:string;
  email:string;
  device_token:string;
  cnic:string;
  address:string;
  role_id:number;
  success:any;
  balance:any;
}
  
  
export class LogUser {
  phone:number;
  password:string;
  device_token:string;
}

export class SocialUser {
  social_id: number;
  user_name: string;
  email: string;
  social_source: string;
  firstname: string;
}