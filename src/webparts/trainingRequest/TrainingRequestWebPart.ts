import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart ,WebPartContext} from '@microsoft/sp-webpart-base';
import * as strings from 'TrainingRequestWebPartStrings';
import TrainingRequest from './components/TrainingRequest';
import { ITrainingRequestProps } from './components/ITrainingRequestProps';
export interface ITrainingRequestWebPartProps {
  ListName: string;
  context: WebPartContext;
  WebUrl: string;
}

export default class TrainingRequestWebPart extends BaseClientSideWebPart<ITrainingRequestWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ITrainingRequestProps> = React.createElement(
      TrainingRequest,
      {
        ListName:this.properties.ListName,
        WebUrl:this.context.pageContext.web.absoluteUrl,
        context:this.context,
      }
    );

    ReactDom.render(element, this.domElement);
  }



  

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('ListName', {
                  label: "List Name"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
