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
            selected_row: null
        } //state

    } //constructor

    /* ******************************************************** lifecycle functions ******************************************************** */
    componentDidMount() {

        //get values passed to this nerdlet from the state context
        const __selected_row = this.context.selected_row;

        this.setState({selected_row: __selected_row});
        console.debug("selected row", __selected_row);
    } //componentDidMount
    
    render() {
        
        return (
          <PlatformStateContext.Consumer>
            {platformUrlState => (
              <NerdletStateContext.Consumer>
                {nerdletUrlState => {

                    console.debug(platformUrlState);

                    if (this.state.selected_row === null) {

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
