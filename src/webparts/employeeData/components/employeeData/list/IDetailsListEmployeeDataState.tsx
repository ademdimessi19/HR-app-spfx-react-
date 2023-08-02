import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { IEmployeeDataModel } from "../Models/IEmployeeDataModel";
export interface IDetailsListEmployeeDataState {
    columns: IColumn[];
    items: IEmployeeDataModel[];
    selectionDetails: string;
    selectedEmployeeData: IEmployeeDataModel;
    showEditStaffPanel:boolean;
    _goBack:VoidFunction;
    _reloadList?:VoidFunction;
}