
export type Token = { token: string };


export interface IUser {
  data?: Token;                   
  error_code?: number;            
  error_message?: string;           
  profiling?: string;             
  timing?: string | null;  
  error_text?:string | null        
}


export interface USER {
  username: string;
  password: string;
}


type TMeta = {
  arg: USER;
  requestId: string;
  requestStatus: string;
}


export interface ResLoginAction {
  payload: IUser;
  type: string;
  meta: TMeta;
}

export type tableData = {
  companySigDate:string,
  companySignatureName:string,
  documentName:string,
  documentStatus:string,
  documentType:string,
  employeeNumber:string,
  employeeSigDate:string,
  employeeSignatureName:string,
  id:string
}

export interface IPost{
    data:tableData[];
    error_code:number,
    error_message:string
}

