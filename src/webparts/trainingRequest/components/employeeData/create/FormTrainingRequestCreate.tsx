import * as React from 'react';
import { IFormTrainingRequestCreateState } from './IFormTrainingRequestCreateState';
import {
  TextField,
  PrimaryButton, Dropdown
} from 'office-ui-fabric-react';
import { TrainingRequestModel } from '../Models/TrainingRequestModel';
import { ITrainingRequestModel } from '../Models/ITrainingRequestModel';
//import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";
import { Label } from 'office-ui-fabric-react/lib/Label';
import { sp } from '@pnp/sp/presets/all';
import { SPHttpClient, SPHttpClientResponse } from '@microsoft/sp-http';
import { PeoplePicker, PrincipalType } from "@pnp/spfx-controls-react/lib/PeoplePicker";

export interface ITrainingRequestCreateProps {
  context: any;
  ListName: string;
}

export default class FormTrainingRequestCreate extends React.Component<ITrainingRequestCreateProps, IFormTrainingRequestCreateState> {
  private validateEmail: string = "";
  constructor(props) {
    super(props);
    sp.setup({
      spfxContext: this.props.context
    });
    this.state = {
      isBusy: false,
      staffreq: new TrainingRequestModel(),
      messageSended: false,
      _goBack: props.state._goBack,
      _reload: props.state._reload,
      CourseList: [],
      CertificationList: [],
    };
  }
  public componentDidMount(): void {
    this._getListFields().then((response) => {
      let Types = []
      console.log("_getListFields", response);
      response.Choices.forEach(element => {
        Types.push({
          key: element,
          text: element
        })
      });
      this.setState({ CourseList: Types });
      console.log("_getListFields Types", Types);

    });
    this._getCertificationList().then((response) => {
      let Types = []
      console.log("_getListFields", response);
      response.Choices.forEach(element => {
        Types.push({
          key: element,
          text: element
        })
      });
      this.setState({ CertificationList: Types });
      console.log("_getListFields Types", Types);

    });
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
          // defaultSelectedUsers={[this.state.EmployeeName?this.state.EmployeeName:""]}
          showHiddenInUI={false}
          principalTypes={[PrincipalType.User]}
          resolveDelay={1000}
          ensureUser={true}
        />
        <div>
          <Label className='customheading'>Email
            {/* <span style={{ color: 'red' }}>*</span> */}
          </Label>
          <TextField
            value={this.validateEmail} maxLength={255}
            onPaste={(event) => { this.validateEmail = event.currentTarget.value; }}
            onChange={(value) => {
              this.validateEmail = value.target['value'];
              this.setState({ staffreq: staffreq });
            }}
            id='Txt_mail'
            onGetErrorMessage={(value: string): string => {
              if (value.length != 0) {
                if (this._validateEmail(value) == true) {
                  staffreq.EmployeeEmail = value;
                  this.setState({ staffreq: staffreq });
                  return "";
                } else {
                  staffreq.EmployeeEmail = "";
                  this.setState({ staffreq: staffreq });
                  return "Invalid email address.";
                }
              } else {
                staffreq.EmployeeEmail = "";
                this.setState({ staffreq: staffreq });
                return "";
              }
            }}

            deferredValidationTime={500}
          />
        </div>
        <div>
          <Label>Job Description</Label>
          <TextField value={staffreq.JobDescription}
            multiline onChange={(event): void => {
              staffreq.JobDescription = event.target['value'];
              this.setState({ staffreq: staffreq });
            }} />
        </div>
        <div>
          <Label className='customheading'>Course List
            {/* <span style={{ color: 'red' }}>*</span> */}
          </Label>
          <Dropdown
            onChanged={(e) => {
              staffreq.Courselist = e.text;
              this.setState({ staffreq: staffreq });
            }}

            id='ddlCourselist'
            placeHolder='Select Course list'
            options={
              this.state.CourseList
            }
          />
        </div>
        <div>
          <Label className='customheading'>Certification List
            {/* <span style={{ color: 'red' }}>*</span> */}
          </Label>
          <Dropdown
            onChanged={(e) => {
              staffreq.Certificationlist = e.text;
              this.setState({ staffreq: staffreq });
            }}

            id='ddlCourselist'
            placeHolder='Select Course list'
            options={
              this.state.CertificationList
            }
          />
        </div>
        <div>
          <Label className='customheading'>Manager Approval
          </Label>
          <label style={{ margin: '0px' }}>
            <input
              type='radio'
              name='Declaration'
              value='Yes'
              checked={staffreq.approval == 'Yes'}
              onChange={(event): void => {
                staffreq.approval = event.target.value;
                this.setState({ staffreq: staffreq });
              }}
            />{' '}
            Yes{' '}
          </label>
          <br></br>
          <label style={{ margin: '0px' }}>
            <input
              type='radio'
              name='Declaration'
              value='No'
              checked={staffreq.approval == 'No'}
              onChange={(event): void => {
                staffreq.approval = event.target.value;
                this.setState({ staffreq: staffreq });
              }}
            />{' '}
            No{' '}
          </label>
        </div>
        <div style={{ marginTop: '20px' }}>
          <div><PrimaryButton style={{ marginRight: '10px' }} text="Create" onClick={() => { this._Create() }} />
            <PrimaryButton text="Cancel" onClick={() => { this.state._goBack(); }} /></div>
        </div>
      </div>
    );
  }
  private _validateEmail(value: any): boolean {
    let emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return emailRegex.test(value);
  }
  public _getPeoplePickerItems = async (items: any[]) => {
    let { staffreq } = this.state;
    if (items.length > 0) {
      staffreq.EmployeeID = items[0].id
      staffreq.EmployeeName = items[0].text
      this.setState({ staffreq: staffreq });
    }
    else {
      //ID=0;
      staffreq.EmployeeID = null
      staffreq.EmployeeName = ""
      this.setState({ staffreq: staffreq });

    }
  }

  private _Create() {

    const { staffreq } = this.state;
    this.setState({ isBusy: true });
    this.createItem(staffreq, this.props.ListName).then((staffreq: ITrainingRequestModel[]) => {
      this.state._reload();
    });
    this.state._goBack();

  }
  public createItem(itemCreated: ITrainingRequestModel, listname): Promise<ITrainingRequestModel[]> {
    let staffReq: ITrainingRequestModel[] = [];
    // add an item to the list

    return sp.web.lists.getByTitle(listname).items.add({
      EmployeeNameId: itemCreated.EmployeeID,
      JobDescription: itemCreated.JobDescription,
      Email: itemCreated.EmployeeEmail,
      CourseList: itemCreated.Courselist,
      CertificationList: itemCreated.Certificationlist,
      approval: itemCreated.approval == "Yes" ? true : false
    }).then((iar: any) => {
      console.log(iar);
      staffReq.push(itemCreated);
      return staffReq;

    });
  }

  public _getListFields(): Promise<any> {
    try {
      var url = this.props.context.pageContext.web.absoluteUrl + "/_api/Web/Lists/GetByTitle('" + this.props.ListName + "')/fields/getByInternalNameOrTitle('CourseList')"

      return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            return response.json();
          }
        });
    } catch (error) {

    }
  }
  public _getCertificationList(): Promise<any> {
    try {
      var url = this.props.context.pageContext.web.absoluteUrl + "/_api/Web/Lists/GetByTitle('" + this.props.ListName + "')/fields/getByInternalNameOrTitle('CertificationList')"

      return this.props.context.spHttpClient.get(url, SPHttpClient.configurations.v1)
        .then((response: SPHttpClientResponse) => {
          if (response.ok) {
            return response.json();
          }
        });
    } catch (error) {

    }
  }

}

