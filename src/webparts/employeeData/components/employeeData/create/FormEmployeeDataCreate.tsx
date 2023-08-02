import * as React from 'react';
import { IFormEmployeeDataCreateState } from './IFormEmployeeDataCreateState';
import {
  TextField,
  PrimaryButton
} from 'office-ui-fabric-react';
import { EmployeeDataModel } from '../Models/EmployeeDataModel';
import { IEmployeeDataModel } from '../Models/IEmployeeDataModel';
import { DatePicker, IDatePickerStrings } from 'office-ui-fabric-react/lib/DatePicker';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Label } from 'office-ui-fabric-react/lib/Label';
import { sp } from '@pnp/sp/presets/all';
export interface IEmployeeDataCreateProps {
  context: any;
  ListName:string;
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
export default class FormEmployeeDataCreate extends React.Component<IEmployeeDataCreateProps, IFormEmployeeDataCreateState> {
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      isBusy: false,
      staffreq: new EmployeeDataModel(),
      messageSended: false,
      _goBack: props.state._goBack,
      _reload: props.state._reload,
    };
  }

  public render(): React.ReactElement<{}> {
    let {staffreq} = this.state;
    console.log("data",staffreq)
    console.log("context create",this.props.context)
    return (
      <div>
        <Label>Employee Name</Label>
        <PeoplePicker
          context={this.props.context}
          personSelectionLimit={1}
          // defaultSelectedUsers={this.state.EmployeeName===""?[]:this.state.EmployeeName}
          required={false}
          onChange={this._getPeoplePickerItems}
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
                   onSelectDate={(e)=>{
                    staffreq.HireDate = e;
                    this.setState({staffreq:staffreq})
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
        <div><PrimaryButton style={{ marginRight: '10px'}} text="Create" onClick={() => {this._Create()}} />
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
    let {staffreq} = this.state;
    if (items.length > 0) {
      staffreq.EmployeeID = items[0].id
      staffreq.EmployeeName = items[0].text
      this.setState({ staffreq:staffreq  });
    }
    else {
      //ID=0;
      staffreq.EmployeeID = null
      staffreq.EmployeeName = ""
      this.setState({ staffreq:staffreq  });

    }
  }
  // private _onChange = (event: React.ChangeEvent<HTMLInputElement>) : void => {

  //   let value= event.target.value;
  //   const {staffreq}=   this.state;
  //   staffreq.name=value;
  //   this.setState({staffreq:staffreq});
  // }

  private _Create (){

    const { staffreq } = this.state;
    this.setState({ isBusy: true });
    this.createItem(staffreq,this.props.ListName).then((staffreq: IEmployeeDataModel[]) => {
      this.state._reload();
    });

    this.state._goBack();

  }
  public createItem(itemCreated: IEmployeeDataModel,listname): Promise<IEmployeeDataModel[]> {
    let staffReq: IEmployeeDataModel[]=[];
    // add an item to the list
    return  sp.web.lists.getByTitle(listname).items.add({
      EmployeeNameId:itemCreated.EmployeeID,
        HireDate: itemCreated.HireDate,
        JobDescription: itemCreated.JobDescription,
      }).then((iar: any) => {
        console.log(iar);
        staffReq.push(itemCreated);
        return staffReq;
      
      });
  }
}

