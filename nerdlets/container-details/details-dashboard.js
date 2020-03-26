import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, navigation, NerdGraphQuery, Spinner } from 'nr1';
import { AreaChart, ChartGroup, HeadingText, TableChart } from 'nr1';
/** nr1 community */
import { EmptyState } from '@newrelic/nr1-community';
import { timeRangeToNrql } from '@newrelic/nr1-community';

/* 3rd party */
import Banner from 'react-js-banner';



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

//        console.debug("** selected row", this.props.selected_row);
//        console.debug("** selected app", this.props.selected_app);
//        console.debug("** selected app", this.props.selected_account);
//        console.debug("** selected app", this.props.launcherUrlState);

        if (this.props.selected_row.containerId === undefined) {

            return(
                <div>
                    <p> Not supporting hosts yet .... work in progress. </p>
                </div>
            );
         } //if
         else {

        const __NRQL_TIMERANGE = timeRangeToNrql(this.props.launcherUrlState);
        const __CONTAINER_CPU_NRQL = `SELECT average(cpuPercent) AS 'CPU Percent' FROM ProcessSample where containerId = '${this.props.selected_row.containerId.value}' ${__NRQL_TIMERANGE} TIMESERIES`;
        const __CONTAINER_MEM_NRQL = `SELECT average(memoryResidentSizeBytes) AS 'Avg Memory' FROM ProcessSample where containerId = '${this.props.selected_row.containerId.value}' ${__NRQL_TIMERANGE} TIMESERIES`;
        const __TRANSACTIONS_NRQL = `SELECT count(*) AS 'Transaction Throughput' FROM Transaction where containerId='${this.props.selected_row.containerId.value}' and appName='${this.props.selected_app}' ${__NRQL_TIMERANGE} TIMESERIES`;
        const __TRANSACTIONS_RT_NRQL = `SELECT average(duration) AS 'Avg Transaction Response Time' FROM Transaction where containerId='${this.props.selected_row.containerId.value}' and appName='${this.props.selected_app}' ${__NRQL_TIMERANGE} TIMESERIES`;
        //const __NON_TRANSACTIONS_NRQL = `SELECT count(*) AS 'Other TXNs' FROM Transaction where containerId='${this.props.selected_row.containerId.value}' and appName!='${this.props.selected_app}' FACET appName TIMESERIES`;

        //const __OTHER_CONTAINER_CPU_NRQL = `SELECT average(cpuPercent) AS 'CPU Percent' FROM ProcessSample where containerId != '${this.props.selected_row.containerId.value}' ${__NRQL_TIMERANGE} TIMESERIES`;
        
        const __OTHER_CONTAINER_CPU_NRQL = `SELECT average(cpuPercent) AS 'CPU Percent' FROM ProcessSample where containerLabel_io.kubernetes.pod.name LIKE '${this.props.selected_row.podname.text}%' AND containerId != '${this.props.selected_row.containerId.value}' ${__NRQL_TIMERANGE} TIMESERIES`;
        const __OTHER_CONTAINER_MEM_NRQL = `SELECT average(memoryResidentSizeBytes) AS 'Avg Memory' FROM ProcessSample where containerLabel_io.kubernetes.pod.name LIKE '${this.props.selected_row.podname.text}%' AND containerId != '${this.props.selected_row.containerId.value}' ${__NRQL_TIMERANGE} TIMESERIES`;
        const __OTHER_TRANSACTIONS_NRQL = `SELECT (count(*) / uniqueCount(containerId)) AS 'Transaction Throughput' FROM Transaction where containerId!='${this.props.selected_row.containerId.value}' and appName='${this.props.selected_app}' ${__NRQL_TIMERANGE} TIMESERIES`;
        const __OTHER_TRANSACTIONS_RT_NRQL = `SELECT average(duration) AS 'Avg Transaction Response Time' FROM Transaction where containerId!='${this.props.selected_row.containerId.value}' and appName='${this.props.selected_app}' ${__NRQL_TIMERANGE} TIMESERIES`;
        //memoryResidentSizeBytes
        //filter: "filter(average(memoryResidentSizeBytes), WHERE apmApplicationNames IS NOT NULL) AS 'container_memory'",

        const __NEIGHBOURS_CPU_NRQL = `SELECT average(cpuPercent) FROM ProcessSample where entityName = '${this.props.selected_row.entityName.value}' facet containerLabel_io.kubernetes.pod.name TIMESERIES LIMIT MAX`;
        const __NEIGHBOURS_MEM_NRQL = `SELECT average(memoryResidentSizeBytes) FROM ProcessSample where entityName = '${this.props.selected_row.entityName.value}' facet containerLabel_io.kubernetes.pod.name TIMESERIES LIMIT MAX`;
        //const __NEIGHBOURS_TXN_NRQL = `SELECT count(*) FROM Transaction where host LIKE '%${this.props.selected_row.entityName.text}%' facet appName TIMESERIES LIMIT MAX`;

        //console.debug("txn", __NEIGHBOURS_TXN_NRQL);
        return(
            <div>
                <Grid>
                    <GridItem columnSpan={12}>
                    <div>
                        <Banner 
                            title = {  'Container : ' + this.props.selected_row.containerId.value} 
                            css = {{ color: '#000', backgroundColor: 'white' }} 
                        />
                    </div>
                    </GridItem>
                </Grid>
                <Grid>
                    <ChartGroup>
                    <GridItem columnSpan={2}>
                        <HeadingText type={HeadingText.TYPE.HEADING_4}>Instance Details</HeadingText>
                    </GridItem>
                    <GridItem columnSpan={10}>
                        <hr/>
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <br/>
                    </GridItem>
                    
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__CONTAINER_CPU_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__CONTAINER_MEM_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__TRANSACTIONS_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__TRANSACTIONS_RT_NRQL}
                            />
                        </GridItem>

                    
                    <GridItem columnSpan={12}>
                        <br/>
                        <hr/>
                        <br/>
                    </GridItem>

                        <GridItem columnSpan={2}>
                            <HeadingText type={HeadingText.TYPE.HEADING_4}>All Other Instances [Averaged]</HeadingText>
                        </GridItem>
                        <GridItem columnSpan={10}>
                            <hr/>
                        </GridItem>
                        <GridItem columnSpan={12}>
                        <br/>
                    </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__OTHER_CONTAINER_CPU_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__OTHER_CONTAINER_MEM_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__OTHER_TRANSACTIONS_NRQL}
                            />
                        </GridItem>
                        <GridItem columnSpan={3}> 
                            <AreaChart
                                accountId={this.props.selected_account.id}
                                query={__OTHER_TRANSACTIONS_RT_NRQL}
                            />
                        </GridItem>
  
                        <GridItem columnSpan={12}>
                        <br/>
                        <hr/>
                        <br/>
                    </GridItem>

                    <GridItem columnSpan={4}>
                   <HeadingText type={HeadingText.TYPE.HEADING_4}>Instance Neighbours ({this.props.selected_row.entityName.text})</HeadingText>
                    </GridItem>
                    <GridItem columnSpan={8}>
                        <hr/>
                    </GridItem>
                    <GridItem columnSpan={12}>
                        <br/>
                    </GridItem>
                    <GridItem columnSpan={6}>
                        
                        <AreaChart
                            accountId={this.props.selected_account.id}
                            query={__NEIGHBOURS_CPU_NRQL}
                            fullWidth  
                        />
                    </GridItem>
                    <GridItem columnSpan={6}>
                        
                        <AreaChart
                            accountId={this.props.selected_account.id}
                            query={__NEIGHBOURS_MEM_NRQL}
                            fullWidth  
                        />
                    </GridItem>
               
                    </ChartGroup>
                </Grid>
               
            </div>
        )
    } // else
    }

} // DetailsDashboard