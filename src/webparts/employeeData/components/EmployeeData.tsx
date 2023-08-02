import * as React from 'react';
//import styles from './EmployeeData.module.scss';
import { IEmployeeDataProps } from './IEmployeeDataProps';
import { DetailsListEmployeeData } from './employeeData/list/DetailsListEmployeeData';
export default class EmployeeData extends React.Component<IEmployeeDataProps, {}> {
  public render(): React.ReactElement<IEmployeeDataProps> {
   
    return (
      <DetailsListEmployeeData ListName={this.props.ListName} context={this.props.context} WebUrl={this.props.WebUrl}/>
    
    );
  }
}
