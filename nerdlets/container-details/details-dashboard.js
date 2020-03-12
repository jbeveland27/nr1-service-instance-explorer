import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, navigation, NerdGraphQuery, Spinner } from 'nr1';
import { AreaChart, ChartGroup } from 'nr1';
/** nr1 community */
import { EmptyState } from '@newrelic/nr1-community';
import { timeRangeToNrql } from '@newrelic/nr1-community';



export default class DetailsDashboard extends React.Component { 

    static propTypes = {
        launcherUrlState: PropTypes.object,
        selected_row: PropTypes.object,
        selected_app: PropTypes.any,
        selected_account: PropTypes.any,
      }; // propTypes
      
      
      constructor(props) {
        super(props);
      }


    render() {

     //   console.debug("** selected row", this.props.selected_row);
     //   console.debug("** selected app", this.props.selected_app);
     //   console.debug("** selected app", this.props.selected_account);

        if (this.props.selected_row.containerId === undefined) {

            return(
                <div>
                    <p> Not supporting hosts yet .... work in progress. </p>
                </div>
            );
         } //if
         else {


        const __CONTAINER_CPU_NRQL = `SELECT average(cpuPercent) AS 'CPU' FROM ProcessSample where containerId = '${this.props.selected_row.containerId.value}' TIMESERIES`;
        const __TRANSACTIONS_NRQL = `SELECT count(*) AS 'TXN TP' FROM Transaction where containerId='${this.props.selected_row.containerId.value}' and appName='${this.props.selected_app}' TIMESERIES`;
        const __TRANSACTIONS_RT_NRQL = `SELECT average(duration) AS 'AVG TXN RT' FROM Transaction where containerId='${this.props.selected_row.containerId.value}' and appName='${this.props.selected_app}' TIMESERIES`;
        const __NON_TRANSACTIONS_NRQL = `SELECT count(*) AS 'Other TXNs' FROM Transaction where containerId='${this.props.selected_row.containerId.value}' and appName!='${this.props.selected_app}' FACET appName TIMESERIES`;


        return(
            <div>
                <Grid>
                    <GridItem columnSpan={12}>
                        <p>HEADER .... </p>
                    </GridItem>
                </Grid>
                <Grid>
                    <ChartGroup>
                        <GridItem columnSpan={2}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__CONTAINER_CPU_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={2}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__TRANSACTIONS_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={2}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__TRANSACTIONS_RT_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={2}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__NON_TRANSACTIONS_NRQL}
                            />
                        </GridItem>
                    </ChartGroup>
                </Grid>
               
            </div>
        )
    } // else
    }

} // DetailsDashboard