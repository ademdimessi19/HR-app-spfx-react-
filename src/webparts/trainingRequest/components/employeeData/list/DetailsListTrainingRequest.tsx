import * as React from 'react';
//import { TextField } from 'office-ui-fabric-react/lib/TextField';
//import { Separator } from 'office-ui-fabric-react/lib/Separator';
import { Fabric } from 'office-ui-fabric-react/lib/Fabric';
//import { Stack } from 'office-ui-fabric-react/lib/Stack';
import { Panel, PanelType } from 'office-ui-fabric-react/lib/Panel';
import { DetailsList, DetailsListLayoutMode, Selection, SelectionMode, IColumn } from 'office-ui-fabric-react/lib/DetailsList';
import { MarqueeSelection } from 'office-ui-fabric-react/lib/MarqueeSelection';
import { mergeStyleSets } from 'office-ui-fabric-react/lib/Styling';
import { CommandBarTrainingRequest } from '../utils/CommandBarTrainingRequest';
import { IDetailsListTrainingRequestState } from './IDetailsListTrainingRequestState';
//import { TrainingRequestDataProvider } from '../sharePointDataProvider/TrainingRequestDataProvider';
import { ITrainingRequestModel } from '../Models/ITrainingRequestModel';
import FormTrainingRequestEdit from '../edit/FormTrainingRequestEdit';
import { sp } from '@pnp/sp/presets/all';
import { SPComponentLoader } from '@microsoft/sp-loader';
import { TrainingRequestModel } from '../Models/TrainingRequestModel';

// import {
//   PrimaryButton
// } from 'office-ui-fabric-react';
// import {
//   WebPartContext
// } from '@microsoft/sp-webpart-base';
const classNames = mergeStyleSets({
  fileIconHeaderIcon: {
    padding: 0,
    fontSize: '16px'
  },
  fileIconCell: {
    textAlign: 'center',
    selectors: {
      '&:before': {
        content: '.',
        display: 'inline-block',
        verticalAlign: 'middle',
        height: '100%',
        width: '0px',
        visibility: 'hidden'
      }
    }
  },
  fileIconImg: {
    verticalAlign: 'middle',
    maxHeight: '16px',
    maxWidth: '16px'
  },
  controlWrapper: {
    display: 'flex',
    flexWrap: 'wrap'
  },
  selectionDetails: {
    marginBottom: '20px'
  }
});
// const controlStyles = {
//   root: {
//     margin: '0 30px 20px 0',
//     maxWidth: '300px'
//   }
// };
export class ITrainingRequestProps {
  context: any;
  ListName: string;
  WebUrl: string;
}

export class DetailsListTrainingRequest extends React.Component<ITrainingRequestProps, IDetailsListTrainingRequestState> {
  private _selection: Selection;
  private _allItems: ITrainingRequestModel[];
  //private _staffRequisitionDataProvider: TrainingRequestDataProvider;
  private showEditStaffPanel: boolean;
  // Use getId() to ensure that the IDs are unique on the page.
  // (It's also okay to use plain strings without getId() and manually ensure uniqueness.)

  constructor(props) {
    super(props);
    SPComponentLoader.loadCss("https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css");

    sp.setup({
      spfxContext: this.props.context
    });
    //this is to chage by wev service rest apiget from the list
    // this._staffRequisitionDataProvider = new TrainingRequestDataProvider({});
    this._allItems = this._Loademployee();



    this._selection = new Selection({
      onSelectionChanged: () => {
        this.setState({
          selectionDetails: this._getSelectionDetails(),
          showEditStaffPanel: this.showEditStaffPanel,

        });
      }
    });


    const columns: IColumn[] = [
      {
        key: 'column0', name: 'Edit', fieldName: 'Edit', minWidth: 50, maxWidth: 100, isResizable: true,
        onRender: (item) => (

          <i style={{ cursor: 'pointer', fontSize: '16px' }} id={item.ItemID}
            onClick={() => {
              this._onItemEdit(item, this)

            }}
            className="fa fa-pencil-square-o" aria-hidden="true"></i>
        ),
      },
      {
        key: 'column1', name: 'Delete', fieldName: 'Delete', minWidth: 50, maxWidth: 100, isResizable: true,
        onRender: (item) => (

          <i style={{ cursor: 'pointer', fontSize: '16px' }} id={item.ItemID}
            onClick={() => {
              { if (window.confirm('Are you sure you want to delete?')) this.deleteItem(item, this); }

            }}
            className="fa fa-trash-o" aria-hidden="true"></i>
        ),
      },
      {
        key: 'column2',
        name: 'EmployeeName',
        isIconOnly: false,
        fieldName: 'EmployeeName',
        minWidth: 100,
        maxWidth: 230,
        data: 'string',
        onColumnClick: this._onColumnClick,
      },
     
      {
        key: 'column3',
        name: 'Email',
        fieldName: 'Email',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      },
      {
        key: 'column4',
        name: 'Courselist',
        fieldName: 'Courselist',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      },
      {
        key: 'column4',
        name: 'Certificationlist',
        fieldName: 'Certificationlist',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      },
      {
        key: 'column4',
        name: 'JobDescription',
        fieldName: 'JobDescription',
        minWidth: 210,
        maxWidth: 350,
        isRowHeader: true,
        isResizable: true,
        isSorted: true,
        isSortedDescending: false,
        // sortAscendingAriaLabel: 'Sorted A to Z',
        // sortDescendingAriaLabel: 'Sorted Z to A',
        onColumnClick: this._onColumnClick,
        data: 'string',
        isPadded: true
      }
    ];
    this.state = {
      items: this._allItems,
      columns: columns,
      selectionDetails: this._getSelectionDetails(),
      showEditStaffPanel: false,
      selectedTrainingRequest: null,
      _goBack: this._hidePanel,

    };
  }
  public componentDidMount(): void {
    this._allItems = this._Loademployee();
    this.setState({ items: this._allItems })
  }
  public render() {
    const { columns, items, showEditStaffPanel } = this.state;
    console.log("context list", this.props.context)
    return (
      <Fabric>
        {/* <Separator /> */}
        <CommandBarTrainingRequest  {...this} context={this.props.context} ListName={this.props.ListName} />
        {/* <Separator /> */}
        <div className={classNames.controlWrapper}>
          {/* <Stack > */}
          {/* <TextField label="Filter by name of the customer:" onChange={() => this._onChangeText} iconProps={{ iconName: 'search' }}  /> */}
          {/* </Stack> */}

        </div>

        <MarqueeSelection selection={this._selection}>
          <DetailsList
            items={items}
            columns={columns}
            selectionMode={SelectionMode.single}
            getKey={this._getKey}
            setKey="set"
            layoutMode={DetailsListLayoutMode.justified}
            isHeaderVisible={true}
            selection={this._selection}
            selectionPreservedOnEmptyClick={true}
            onItemInvoked={(item) => { this._onItemInvoked(item, this); }}
            enterModalSelectionOnTouch={true}
            ariaLabelForSelectionColumn="Toggle selection"
            ariaLabelForSelectAllCheckbox="Toggle selection for all items"
            checkButtonAriaLabel="Row checkbox"
          />

        </MarqueeSelection>
        <div>
          <Panel isOpen={showEditStaffPanel} onDismiss={this._hidePanel} type={PanelType.medium} headerText="Update Training Request">
            <FormTrainingRequestEdit {...this} context={this.props.context} ListName={this.props.ListName} />
          </Panel>
        </div>
      </Fabric>
    );
  }
  private _onItemEdit(item: any, value: any): void {
    try {
      let itemRmp = item as ITrainingRequestModel;
      console.log("df", itemRmp)
      this.getItemsById(itemRmp.ItemID).then((rmps: any) => {

        let itemrmps = rmps[0] as ITrainingRequestModel;
        this.setState({ selectedTrainingRequest: itemrmps });
        this.setState({ showEditStaffPanel: true });
      });
    } catch (error) {
      console.log("open Edit Form", error)
    }
  }
  private _Loademployee() {
    const items: ITrainingRequestModel[] = [];
    this.getItems().then((staffreq: ITrainingRequestModel[]) => {
      staffreq.forEach(element => {
        items.push({
          ItemID: element.ItemID,
          EmployeeID: element.EmployeeID,
          EmployeeName: element.EmployeeName,
          JobDescription: element.JobDescription,
          Email: element.Email,
          Courselist: element.Courselist,
          Certificationlist: element.Certificationlist
        });
      });
      this.setState({ items: items })
      return items;

    });
    return items;
  }
  //To Update the items in the list
  public componentDidUpdate(previousProps: any, previousState: IDetailsListTrainingRequestState) {

  }

  private _getKey(item: any, index?: number): string {
    return item.key;
  }
  // private _onChangeText = (ev: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>, text: string): void => {
  //   this.setState({

  //     items: text ? this._allItems.filter(i => i.name.toLowerCase().indexOf(text) > -1) : this._allItems
  //   });
  // }

  private _onItemInvoked(item: any, value: any): void {
    let itemStaffReq = item as ITrainingRequestModel;
    value.setState({ selectedStaffRequisition: itemStaffReq });
    value.setState({ showEditStaffPanel: true });

  }


  private _hidePanel = () => {


    const items: ITrainingRequestModel[] = [];
    this.getItems().then((staffreq: ITrainingRequestModel[]) => {
      staffreq.forEach(element => {
        items.push({
          ItemID: element.ItemID,
          EmployeeID: element.EmployeeID,
            EmployeeName: element.EmployeeName,
          Email: element.Email,
          Courselist: element.Courselist,
          Certificationlist: element.Certificationlist,
          JobDescription: element.JobDescription,
        });
      });
      this.setState({ showEditStaffPanel: false, items: items })
    });

  }

  private _getSelectionDetails(): string {
    const selectionCount = this._selection.getSelectedCount();
    this.setState({ selectedTrainingRequest: this._selection.getSelection()[0] as ITrainingRequestModel });
    switch (selectionCount) {
      case 0:
        return 'No items selected';
      case 1:
        return '1 item selected: ' //+ (this._selection.getSelection()[0] as ITrainingRequestModel).name;
      default:
        return `${selectionCount} items selected`;
    }
  }

  private _onColumnClick = (ev: React.MouseEvent<HTMLElement>, column: IColumn): void => {
    const { columns, items } = this.state;
    const newColumns: IColumn[] = columns.slice();
    const currColumn: IColumn = newColumns.filter(currCol => column.key === currCol.key)[0];
    newColumns.forEach((newCol: IColumn) => {
      if (newCol === currColumn) {
        currColumn.isSortedDescending = !currColumn.isSortedDescending;
        currColumn.isSorted = true;
      } else {
        newCol.isSorted = false;
        newCol.isSortedDescending = true;
      }
    });
    const newItems = _copyAndSort(items, currColumn.fieldName!, currColumn.isSortedDescending);
    this.setState({
      columns: newColumns,
      items: newItems
    });
  }
  public getItems(): Promise<ITrainingRequestModel[]> {
    let staffReq: ITrainingRequestModel[] = [];
    // get all the customers from the list customers in SharePoint
    //return sp.web.lists.getByTitle(this.props.ListName).items.select("*").get().then((result_employee: any[]) => {
     return sp.web.lists.getByTitle(this.props.ListName).items.select("*", "EmployeeName/Title", "EmployeeName/ID").expand("EmployeeName").get().then((result_employee: any[]) => {

      result_employee.forEach(employee => {
        if (typeof employee != 'undefined' && employee) {
          //uncommented and the next statement validates all the fields to not allow nulls values
          //if(typeof customer.Title!='undefined' && customer.Title 
          // && typeof customer.Id!='undefined' && customer.Id &&
          // typeof customer.LastName!='undefined' && customer.LastName){
          staffReq.push({
            ItemID: employee.ID,
            EmployeeID: employee.EmployeeName.ID,
            EmployeeName: employee.EmployeeName.Title,
            JobDescription: employee.JobDescription,
            Email: employee.Email,
            Courselist: employee.CourseList,
            Certificationlist: employee.CertificationList,
            approval:employee.approval==true?"Yes":"No"
          })
        }
      });
      return staffReq;
    });
  }
  public getItemsById(Itemid): Promise<any> {
    try {
      let rmps: ITrainingRequestModel[] = [];

      return sp.web.lists.getByTitle(this.props.ListName).items.getById(Itemid)
     // .select("*").get().then((employee: any) => {
        .select("*", "EmployeeName/Title", "EmployeeName/ID", "EmployeeName/EMail").expand("EmployeeName").get().then((employee: any) => {
          if (typeof employee != 'undefined' && employee) {


            rmps.push({
              ItemID: employee.ID,
              EmployeeID: employee.EmployeeName.ID,
              EmployeeName: employee.EmployeeName.Title,
              JobDescription: employee.JobDescription,
              EmployeeEmail: employee.EmployeeName.EMail,
              Email: employee.Email,
              Courselist: employee.CourseList,
              Certificationlist: employee.CertificationList,
              approval:employee.approval==true?"Yes":"No"
            });
          }
          return rmps;
        }, (error: any): void => {
          console.log('Error while getting an item: ' + error);
        });

    } catch (error) {
      console.log("Error while getting item by id", error)
    }

  }
  private deleteItem(item: any, value: any): void {
    let itemproduct = item as TrainingRequestModel;
    this.deleteItems(itemproduct);
    const items = this.state.items.filter(i => i.ItemID !== item.ItemID);
    this.setState({ items });
  }
  public deleteItems(itemDeleted: ITrainingRequestModel): Promise<ITrainingRequestModel[]> {
    try {
      let id = itemDeleted.ItemID;
      let rmps: ITrainingRequestModel[] = [];
      return sp.web.lists.getByTitle(this.props.ListName).items.getById(id).recycle().then((result_rmp) => {
        rmps.push(itemDeleted);
        return rmps;
      });
    } catch (error) {
      console.log('catch Error while deleting the item: ' + error);

    }

  }
}

function _copyAndSort<T>(items: T[], columnKey: string, isSortedDescending?: boolean): T[] {
  const key = columnKey as keyof T;
  return items.slice(0).sort((a: T, b: T) => ((isSortedDescending ? a[key] < b[key] : a[key] > b[key]) ? 1 : -1));
}










