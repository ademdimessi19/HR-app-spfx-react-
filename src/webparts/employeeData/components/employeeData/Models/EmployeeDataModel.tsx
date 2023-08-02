import {IEmployeeDataModel} from './IEmployeeDataModel';
//import { AttachmentFileInfo } from '@pnp/sp/src/attachmentfiles';

export class EmployeeDataModel implements IEmployeeDataModel {
   
    ItemID?:number;
    EmployeeID?: any;
    EmployeeName?:string;
    EmployeeEmail?:string;
    HireDate?:Date;
    JobDescription?:string;
}
