import * as React from 'react';
//import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { IEmployeeDataModel } from '../Models/IEmployeeDataModel';
import { PanelType, Panel,PrimaryButton } from 'office-ui-fabric-react';
import FormEmployeeDataCreate from '../create/FormEmployeeDataCreate';
export interface ICommandBarStaffRequisitionState {
  isVisible: boolean;
  staffReq: IEmployeeDataModel;
  messageSended: boolean;
  _goBack:VoidFunction;
  _reload:VoidFunction;
}
export interface ICommandBarProps {
  context:any;
  ListName:string;
}

export class CommandBarEmployeeData extends React.Component<ICommandBarProps, ICommandBarStaffRequisitionState> {

  private  _staffreq:IEmployeeDataModel;
  /**
   *Cosnstructor og CommandBarCustomers
   */
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      staffReq: this._staffreq,
      messageSended: false,
      _goBack:this._hidePanel,
      _reload:props.state._goBack,
     
    };
  }

  public render(): JSX.Element {
    return (
      <div>
       <PrimaryButton
          iconProps={{ iconName: "Add" }}
          onClick={() => {
            this.setState({ isVisible: true });
          }}
        >Create</PrimaryButton>
        <Panel isOpen={this.state.isVisible} onDismiss={this._hidePanel} type={PanelType.medium} headerText={"New Employee"}>
        <FormEmployeeDataCreate {...this}  context={this.props.context} ListName={this.props.ListName}/>
        </Panel>
      </div>
    );
  }

  
  private _hidePanel = () => {
    this.setState({ isVisible: false });
  }


}