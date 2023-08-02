import * as React from 'react';
//import { CommandBar } from 'office-ui-fabric-react/lib/CommandBar';
import { ITrainingRequestModel } from '../Models/ITrainingRequestModel';
import { PanelType, Panel,PrimaryButton } from 'office-ui-fabric-react';
import FormTrainingRequestCreate from '../create/FormTrainingRequestCreate';
export interface ICommandBarStaffRequisitionState {
  isVisible: boolean;
  staffReq: ITrainingRequestModel;
  messageSended: boolean;
  _goBack:VoidFunction;
  _reload:VoidFunction;
}
export interface ICommandBarProps {
  context:any;
  ListName:string;
}

export class CommandBarTrainingRequest extends React.Component<ICommandBarProps, ICommandBarStaffRequisitionState> {

  private  _staffreq:ITrainingRequestModel;
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
        <Panel isOpen={this.state.isVisible} onDismiss={this._hidePanel} type={PanelType.medium} headerText={"New Training Request"}>
        <FormTrainingRequestCreate {...this}  context={this.props.context} ListName={this.props.ListName}/>
        </Panel>
      </div>
    );
  }

  
  private _hidePanel = () => {
    this.setState({ isVisible: false });
  }


}