import React from 'react';
import PropTypes from 'prop-types';

import {
    PlatformStateContext,
    NerdletStateContext,
    EntityByGuidQuery,
    HeadingText,
    BlockText,
    Spinner
  } from 'nr1';

  import DetailsDashboard from './details-dashboard';

// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class ContainerDetailsNerdlet extends React.Component {
    
    static contextType = NerdletStateContext;

    static propTypes = {
        nerdletUrlState: PropTypes.object,
        launcherUrlState: PropTypes.object,
        accountId: PropTypes.any,
        selected_row: PropTypes.any,
        devices: PropTypes.any
    };

    constructor(props) {
        super(props);

        this.state = {
            selected_row: null,
            selected_app: null
        } //state

    } //constructor

    /* ******************************************************** lifecycle functions ******************************************************** */
    componentDidMount() {

        //get values passed to this nerdlet from the state context
        const __selected_row = this.context.selected_row;
        const __selected_app = this.context.selected_app;
        const __selected_account = this.context.selected_account;
        this.setState({selected_row: __selected_row});
        this.setState({selected_app: __selected_app});
        this.setState({selected_account: __selected_account});
        console.debug("selected row", __selected_row);
    } //componentDidMount
    
    render() {
        
        return (
          <PlatformStateContext.Consumer>
            {platformUrlState => (
              <NerdletStateContext.Consumer>
                {nerdletUrlState => {

                    console.debug(platformUrlState);

                    if (this.state.selected_row === null || this.state.selected_app === null || this.state.selected_account === null) {

                        return(<div>
                            <Spinner/>
                        </div>)
                    } // if
                    else { 
                        return(
                            <div>
                                <DetailsDashboard
                                   launcherUrlState={platformUrlState}
                                   selected_row={this.state.selected_row} 
                                   selected_app={this.state.selected_app}
                                   selected_account={this.state.selected_account}
                                />
                            </div>
                        )
                    } // else
                }}
              </NerdletStateContext.Consumer>
            )}
          </PlatformStateContext.Consumer>
        );
      }
}
