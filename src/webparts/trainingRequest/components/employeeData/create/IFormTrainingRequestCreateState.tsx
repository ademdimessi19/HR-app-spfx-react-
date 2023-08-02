import { ITrainingRequestModel } from "../Models/ITrainingRequestModel";

export interface IFormTrainingRequestCreateState {
  isBusy: boolean;
  staffreq: ITrainingRequestModel;
  messageSended: boolean;
  _goBack:VoidFunction;
  _reload:VoidFunction;
  CourseList:any;
  CertificationList:any;
}
