import React from 'react';

import {
    PlatformStateContext,
    NerdletStateContext,
    EntityByGuidQuery,
    HeadingText,
    BlockText,
    Spinner
  } from 'nr1';


// https://docs.newrelic.com/docs/new-relic-programmable-platform-introduction

export default class ContainerDetailsNerdlet extends React.Component {
    
    render() {
        
        return (
          <PlatformStateContext.Consumer>
            {platformUrlState => (
              <NerdletStateContext.Consumer>
                {nerdletUrlState => {

                    console.debug(nerdletUrlState);
                    return(
                        <div>
                            <p>{nerdletUrlState.selected_row}</p>
                            <p>{nerdletUrlState.launcherUrlState}</p>
                            <p>hello nerdlet</p>
                        </div>
                    )
                }}
              </NerdletStateContext.Consumer>
            )}
          </PlatformStateContext.Consumer>
        );
      }
}
