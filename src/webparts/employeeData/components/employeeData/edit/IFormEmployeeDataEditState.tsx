import { IEmployeeDataModel } from "../Models/IEmployeeDataModel";

export interface IFormEmployeeDataEditState {
  isBusy: boolean;
  staffreq: IEmployeeDataModel;
  messageSended: boolean;
  showEditstaffPanel:boolean;
  _goBack:VoidFunction;
  _reload:VoidFunction;
}
