import { IEmployeeDataModel } from "../Models/IEmployeeDataModel";

export interface IFormEmployeeDataCreateState {
  isBusy: boolean;
  staffreq: IEmployeeDataModel;
  messageSended: boolean;
  _goBack:VoidFunction;
  _reload:VoidFunction;
}
