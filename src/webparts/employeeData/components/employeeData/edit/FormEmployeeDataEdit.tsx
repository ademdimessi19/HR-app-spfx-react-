import * as React from 'react';
import { IFormEmployeeDataEditState } from './IFormEmployeeDataEditState';
import {
  TextField,
  PrimaryButton,
} from 'office-ui-fabric-react';
//import { EmployeeDataModel } from '../Models/EmployeeDataModel';
import { IEmployeeDataModel } from '../Models/IEmployeeDataModel';
import { DatePicker, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Label } from 'office-ui-fabric-react/lib/Label';
import { sp } from '@pnp/sp/presets/all';
export interface IEmployeeDataEditProps {
  context: any;
  ListName: string;
}
const dayPickerStrings: IDatePickerStrings = {
  months: [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ],
  shortMonths: [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec'
  ],
  days: [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday'
  ],
  shortDays: [
    'S',
    'M',
    'T',
    'W',
    'T',
    'F',
    'S'
  ],

  goToToday: 'Go to today',
  prevMonthAriaLabel: 'Go to previous month',
  nextMonthAriaLabel: 'Go to next month',
  prevYearAriaLabel: 'Go to previous year',
  nextYearAriaLabel: 'Go to next year'
};
export default class FormEmployeeDataEdit extends React.Component<IEmployeeDataEditProps, IFormEmployeeDataEditState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      isBusy: false,
      staffreq: props.state.selectedEmployeeData,
      messageSended: false,
      showEditstaffPanel: props.state.showEditstaffPanel,
      _goBack: props.state._goBack,
      _reload: props.state._reload,
    };
    if (this.state.staffreq.HireDate !== null) {
      //this.CreationDate=this.state.rmp.Date_Creation.toString();
      let startDate: string[] = [this.state.staffreq.HireDate].toString().split("-");
      this.state.staffreq.HireDate = new Date(parseInt(startDate[2]), parseInt(startDate[1]) - 1, parseInt(startDate[0]));
    }
  }

  public render(): React.ReactElement<{}> {
    let { staffreq } = this.state;
    console.log("data", staffreq)
    console.log("context create", this.props.context)
    return (
      <div>
        <Label>Employee Name</Label>
        <PeoplePicker
          context={this.props.context}
          personSelectionLimit={1}
          // defaultSelectedUsers={this.state.EmployeeName===""?[]:this.state.EmployeeName}
          required={false}
          onChange={this._getPeoplePickerItems}
          defaultSelectedUsers={[this.state.staffreq.EmployeeID != null ? this.state.staffreq.EmployeeEmail : ""]}
          // defaultSelectedUsers={[this.state.EmployeeName?this.state.EmployeeName:""]}
          showHiddenInUI={false}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}
          ensureUser={true}
        />
        <div>
          <Label>Hire Date</Label>
          <DatePicker maxDate={new Date()} allowTextInput={false} strings={dayPickerStrings}
            value={staffreq.HireDate}
            onSelectDate={(e) => {
              staffreq.HireDate = e;
              this.setState({ staffreq: staffreq })
            }}
            ariaLabel="Select a date" formatDate={this._onFormatDate} />
        </div>
        <div>
          <Label>Job Description</Label>
          <TextField value={staffreq.JobDescription}
            multiline onChange={(event): void => {
              staffreq.JobDescription = event.target['value'];
              this.setState({ staffreq: staffreq });
            }} />
        </div>
        <div style={{marginTop:'20px'}}>
          <div><PrimaryButton  style={{ marginRight: '10px'}} text="Update"
           onClick={() => { this._UpdateStaffRequisition() }} />
           <PrimaryButton text="Cancel" onClick={() => {  this.state._goBack(); }} /></div>
        </div>

      </div>
    );
  }
  private _onFormatDate = (date: Date): string => {
    let month = date.getMonth() + 1;
    return (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) + '-' +
      (month < 10 ? '0' + month : month) + '-' + (date.getFullYear());
  };
  public _getPeoplePickerItems = async (items: any[]) => {
    let { staffreq } = this.state;
    if (items.length > 0) {
      staffreq.EmployeeID = items[0].id
      staffreq.EmployeeName = items[0].text
      staffreq.EmployeeEmail= items[0].loginName.split('|')[2]
      this.setState({ staffreq: staffreq });
    }
    else {
      //ID=0;
      staffreq.EmployeeID = null
      staffreq.EmployeeName = ""
      this.setState({ staffreq: staffreq });

    }
  }
  // private _onChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {

  //   let value= event.target.value;
  //   const {staffreq}=   this.state;
  //   staffreq.name=value;
  //   this.setState({staffreq:staffreq});
  // }

  private _UpdateStaffRequisition() {

    const { staffreq } = this.state;
    this.setState({ isBusy: true });
    this.updateItem(staffreq).then((staffreq: IEmployeeDataModel[]) => {
      console.log("Updated:" + staffreq);
      this.state._goBack();
    });
   // this.state._goBack();
  }
  public updateItem(itemUpdated: IEmployeeDataModel): Promise<IEmployeeDataModel[]> {
    // update an item to the list
    let staffReq: IEmployeeDataModel[] = [];

    return sp.web.lists.getByTitle(this.props.ListName).items.getById(itemUpdated.ItemID).update({
      EmployeeNameId: itemUpdated.EmployeeID,
      HireDate: itemUpdated.HireDate,
      JobDescription: itemUpdated.JobDescription,
    }).then((result_customers) => {
      console.log(result_customers);
      staffReq.push(itemUpdated);
      return staffReq;
    });
  }
}

