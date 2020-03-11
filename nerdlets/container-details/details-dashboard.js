import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, navigation, NerdGraphQuery, Spinner } from 'nr1';

/** nr1 community */
import { EmptyState } from '@newrelic/nr1-community';
import { timeRangeToNrql } from '@newrelic/nr1-community';



export default class DetailsDashboard extends React.Component { 

    static propTypes = {
        launcherUrlState: PropTypes.object,
        selected_row: PropTypes.object
      }; // propTypes
      
      
      constructor(props) {
        super(props);
      }


      render() {


        return(
            <div>
                <p>hello</p>
            </div>
        )
      }

} // DetailsDashboard