import { IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { ITrainingRequestModel } from "../Models/ITrainingRequestModel";
export interface IDetailsListTrainingRequestState {
    columns: IColumn[];
    items: ITrainingRequestModel[];
    selectionDetails: string;
    selectedTrainingRequest: ITrainingRequestModel;
    showEditStaffPanel:boolean;
    _goBack:VoidFunction;
    _reloadList?:VoidFunction;
}