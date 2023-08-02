import { ITrainingRequestModel } from "../Models/ITrainingRequestModel";

export interface IFormTrainingRequestEditState {
  isBusy: boolean;
  staffreq: ITrainingRequestModel;
  messageSended: boolean;
  showEditstaffPanel:boolean;
  _goBack:VoidFunction;
  _reload:VoidFunction;
  CourseList:any;
  CertificationList:any;
}
