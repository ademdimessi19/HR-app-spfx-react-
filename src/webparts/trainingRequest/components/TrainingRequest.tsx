import * as React from 'react';
//import styles from './TrainingRequest.module.scss';
import { ITrainingRequestProps } from './ITrainingRequestProps';
import { DetailsListTrainingRequest } from './employeeData/list/DetailsListTrainingRequest';
export default class TrainingRequest extends React.Component<ITrainingRequestProps, {}> {
  public render(): React.ReactElement<ITrainingRequestProps> {
   
    return (
      <DetailsListTrainingRequest ListName={this.props.ListName} context={this.props.context} WebUrl={this.props.WebUrl}/>
    );
  }
}
