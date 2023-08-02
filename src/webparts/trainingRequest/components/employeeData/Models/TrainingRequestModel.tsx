import {ITrainingRequestModel} from './ITrainingRequestModel';
//import { AttachmentFileInfo } from '@pnp/sp/src/attachmentfiles';

export class TrainingRequestModel implements ITrainingRequestModel {
   
    ItemID?:number;
    EmployeeID?: any;
    EmployeeName?:string;
    EmployeeEmail?:string;
    Email?:string;
    JobDescription?:string;
    Courselist?: any;
    Certificationlist?: any;
    approval?: any;
}
