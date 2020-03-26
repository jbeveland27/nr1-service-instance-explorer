import React from 'react';
import PropTypes from 'prop-types';
import { Grid, GridItem, navigation, NerdGraphQuery, Spinner } from 'nr1';
import _ from 'underscore';

/** nr1 community */
import { EmptyState } from '@newrelic/nr1-community';
import { timeRangeToNrql } from '@newrelic/nr1-community';

import Table from './table';

export default class SIExplorerBody extends React.Component {
  
  static propTypes = {
    launcherUrlState: PropTypes.object,
    account: PropTypes.any,
    app: PropTypes.any,
    tableConfig: PropTypes.any,
    compute: PropTypes.any
  }; // propTypes
  
  
  constructor(props) {
    super(props);

    this.state = {
      tableData: null,
      tableColumns: null
    };

    this.pickRow = this.pickRow.bind(this);
  }

  /**
   * 
   * @param {*} _account 
   * @param {*} _app 
   */
  async _getPodWhereClause(_account, _app) {

    const __query = `{
      actor {
        account(id: ${_account.id}) {
          nrql(query: "SELECT uniques(host) from Transaction WHERE appName = '${_app}' LIMIT MAX") {
            results
          }
        }
      }
    }`;

    const __results = await NerdGraphQuery.query({ query: __query});
    var __uniqueRoots = [];
    var __NRQL_SNIPPET = "";

    if (__results.data.actor.account.nrql !== null) {

      __results.data.actor.account.nrql.results[0]["uniques.host"].map(_host => {

        __uniqueRoots = this._reconcileRoot(__uniqueRoots, _host);

      });
    } // if

    __NRQL_SNIPPET = "";

    __uniqueRoots.map(_root => {

      __NRQL_SNIPPET = __NRQL_SNIPPET + "OR containerLabel_io.kubernetes.pod.name LIKE '" + _root + "' ";
    });

    return(__NRQL_SNIPPET);
  } // _getPodWhereClause

  /**
   * 
   * @param {*} _uniqueRoots 
   * @param {*} _host 
   */
  _reconcileRoot(_uniqueRoots, _host) {

    const __truncatedHostname = this._truncateHostname(_host);
    var __match = false;

    if (_uniqueRoots.length === 0) {

      _uniqueRoots.push(__truncatedHostname); //add the candidate host
    } // if
    else if (_uniqueRoots.length > 0) {

      _uniqueRoots.map(_candidate => {

        if (!__match && __truncatedHostname.indexOf(_candidate) > -1) {
          __match = true;
        } //if

      }); // map

      if (!__match) {

        _uniqueRoots.push(__truncatedHostname);
      } //if
    } // else if
    else { 
      console.debug("There is nothing to reconcile.");
    } // else 

    return(_uniqueRoots);
  } // _reconcileRoot

  /**
   * Truncates the given hostname to the matching root of a podname for Infrastructure 
   * @param {*} _host 
   */
  _truncateHostname(_host) {

    var __truncation_1 = null;
    var __truncatedName = null

    if (_host !== null && _host !== undefined) {

      try {

        __truncation_1 = _host.substring(0, _host.lastIndexOf("-"));
        __truncatedName = __truncation_1.substring(0, __truncation_1.lastIndexOf("-"));
      } // try
      catch(err) {

        console.debug("Unable to truncate the hostname: " + _host);
      } // catch

      return(__truncatedName);
    } //if

  } // _truncateHostname

  /**
   * 
   * @param {*} _account 
   * @param {*} _app 
   * @param {*} _compute 
   * @param {*} _tableConfig 
   * @param {*} _launcherUrlState 
   */
async _getTableData(_account, _app, _compute, _tableConfig, _launcherUrlState) {

  // get the NRQL for this table ...
  var __NRQL_SELECT_ARRAY = [];
  var __NRQL_FROM_ARRAY = [];
  var __NRQL = "SELECT ";
  const __NRQL_TIMERANGE = timeRangeToNrql(_launcherUrlState);
  var __NRQL_POD = "";
  var __data = [];

  if (_compute === "containerId")  {

    __NRQL_POD = await this._getPodWhereClause(_account, _app);
  } // if

  _tableConfig.map(_config => {

    if (_config.applicability === _compute || _config.applicability === "any") {

      if (_config.enabled) {
        
        __NRQL_SELECT_ARRAY.push(_config.filter);

        if(__NRQL_FROM_ARRAY.indexOf(_config.source) === -1) {

          __NRQL_FROM_ARRAY.push(_config.source);
        } // if
      } // if
    } // if
  });

    // assemble the NRQL
  __NRQL_SELECT_ARRAY.map(_filter =>{

    __NRQL = __NRQL + _filter + ", ";
  });

  // trim the last comma
  __NRQL = __NRQL.replace(/,\s*$/, "");

  __NRQL = __NRQL + " FROM ";

  __NRQL_FROM_ARRAY.map(_source => {

    __NRQL = __NRQL + _source + ",";
  });

  // trim the last comma
  __NRQL = __NRQL.replace(/,\s*$/, "");

  __NRQL = __NRQL + " WHERE " + "appName = '" + _app + "' OR apmApplicationNames LIKE '%|" + _app + "|%' " + __NRQL_POD + " FACET ";

  if (_compute === "containerId") {

    __NRQL = __NRQL + _compute;
  } // if
  else { 

    __NRQL = __NRQL + "host,fullHostname";
  } // else

  __NRQL = __NRQL + " " + __NRQL_TIMERANGE + " LIMIT MAX";
//console.debug("nrql", __NRQL);
  const __query = `{
    actor {
      account(id: ${_account.id}) {
        nrql(query: "${__NRQL}") {
          results
        }
      }
    }
}`;

const __result = await NerdGraphQuery.query({ query: __query, fetchPolicyType: NerdGraphQuery.FETCH_POLICY_TYPE.NO_CACHE });
//console.debug("result", __result);
if (_compute !== undefined && _compute !==null){

    if (_compute !== "containerId") {
      
        __data = await this.reconcileHosts(__result.data.actor.account.nrql.results);
    } //if
    else {
        __data = __result.data.actor.account.nrql.results;
        //data.actor.account.nrql.results
    } //else
}//if

const __tableCols = this._getTableComumnModel(this.props.compute, this.props.tableConfig);
var __processedTableData = [];

  __data.map(_item => {

        if (_item.txn > 0) {
          
          var __objTMP = {} // hee hee
          __tableCols.map(_col => {

            if (_col.name === "alertStatus") {
              __objTMP["alertStatus"] = {text: 0, value: 0};
            } // if
            else if (_col.name === "txn_50_percentile[50]") {
              __objTMP[_col.name] = {text: this.formatMetric(_col.name, _item.txn_50_percentile[50]), value: _item.txn_50_percentile[50]}
            }  // else if
            else if (_col.name === "txn_90_percentile[90]") {
              
              __objTMP[_col.name] = {text: this.formatMetric(_col.name, _item.txn_90_percentile[90]), value: _item.txn_90_percentile[90]}
            } // else if
            else {
              __objTMP[_col.name] = {text: this.formatMetric(_col.name, _item[_col.name]), value: _item[_col.name]}
            } // else
        
          });

          if (_compute !== "containerId") {
            __objTMP["hostname"] = {text: this.formatMetric("hostname", _item.hostfullHostname[1]), value: _item.hostfullHostname[1]}
          } // if
          else {
            __objTMP["containerId"] = {text: this.formatMetric("containerId", _item["containerId"]), value: _item["containerId"]}
          } // else
    
          __processedTableData.push(__objTMP);
        } // if  
      }); // map

  this.setState({ tableColumns: __tableCols });
  this.setState({ tableData: __processedTableData });

} // _getTableData

/**
 * 
 * @param {*} _results 
 */
async reconcileHosts(_results) {

  var __reconciledResults = [];

  /* loop and discover the host name compliment */
  _results.map(__result => {
   
      //if (__result.entityName !== null) {
      if (__result.hostfullHostname[0] === null) {
          __reconciledResults.push(__result);
      } //if
  });

  var __foundHost;

  /* loop and reconcile the app instance data */
  _results.map(__result => {
      //if (__result.apm_host !== null) {
      if (__result.hostfullHostname[1] === null) {
//hostfullHostname
          __foundHost = __reconciledResults.find(__element => __result.hostfullHostname[0] === __element.hostfullHostname[1] );

          if (__foundHost !== undefined) {
              __foundHost.percentile = __result.percentile;
              __foundHost.txnrt = __result.txnrt;
              __foundHost.errrt = __result.errrt;
              __foundHost.txn = __result.txn;
          } //if
          else {
              __result.hostfullHostname[1] = __result.hostfullHostname[0];
              __reconciledResults.push(__result);
          } //else

      } //if

  });
  return(__reconciledResults);
} //reconcileHosts


formatMetric(_name, _value) {

  if (_name === "errrt" || _name === "txnrt" || _name === "container_cpu" || _name === "host_cpu") {

    return(Math.round(_value * 100) / 100);
  } //if
  else if (_name === "podname" || _name === "containerId") {

    if (_value !== null) {

      return(_value.substring(0, 15));
    } // if
    else { 

      return("no value");
    } // else

  } //else if
  else if (_name === "txn_90_percentile[90]" || _name === "txn_50_percentile[50]" || _name === "txnavg") {

    return(Math.round(_value * 10000) / 10000);
  } //else if
  else if (_name === "container_memory" || _name === "host_memory") {

    return(_value / 1048576).toFixed(2);
  } //else if
  else if (_name === "entityName") {

    console.debug("value  " + _value)
    if (_value !== null) {

      return(_value.substring(0, _value.indexOf(".")));
    }
    else { 
      return("unknown");
    } // else
  } // else if
  else {

    return(_value);
  } // else
  
} //formatMetric

  /**
   * 
   */
  sortTable = (col, order) => {
    const { tableData } = this.state;

    const sorted = tableData.sort((a, b) =>
      // eslint-disable-next-line no-nested-ternary
      order === 'asc'
        ? a[col].value > b[col].value
          ? 1
          : -1
        : a[col].value < b[col].value
        ? 1
        : -1
    );

    this.setState({
      tableData: sorted
    });
  } // sortTable

async reload(_account, _app, _compute, _tableConfig, _launcherUrlState) {

    await this._getTableData(_account, _app, _compute, _tableConfig, _launcherUrlState);
    //await this._getPodWhereClause(_account, _app);

} // reload

  _getTableComumnModel(_compute, _tableConfig) { 

    var __tableCols = [
      { title: '', name: 'alertStatus', class: 'strip-width' }
    ];

    if (_compute !== "containerId") {

      __tableCols.push(
        {
          title: "Hostname",
          name: "hostname"
        } // ????????? ^^^ 
      )
    } // if
    else { 

      __tableCols.push(
        {
          title: "Container ID",
          name: "containerId"
        }
      )
    } // else

    _tableConfig.map(_config => {

      if (_config.applicability === _compute || _config.applicability === "any") {

        if (_config.enabled) {

          __tableCols.push(
            {
              title: _config.title,
              name: _config.reference
            }
          );
        } //if

      } // if
    });

    return(__tableCols);

  }// _getTableComumnModel() 

  pickRow(_row) {

    console.debug("this row picked", _row);

    const __confignerdlet = {
      id: 'container-details',
      urlState: {
        selected_row: _row,
        selected_app: this.props.app,
        selected_account: this.props.account
      }
    }
 
    navigation.openStackedNerdlet(__confignerdlet);
  } // pickRow
  
  
  async shouldComponentUpdate(nextProps) {

    if (this.props.launcherUrlState.timeRange !== nextProps.launcherUrlState.timeRange 
      || this.props.app !== nextProps.app 
      || this.props.account !== nextProps.account
      || this.props.compute !== nextProps.compute
      || this.props.tableConfig !== nextProps.tableConfig) {

        // console.debug("current app", this.props.app);
        // console.debug("next app", nextProps.app);
        // console.debug("current launcherUrlState time", this.props.launcherUrlState.timeRange);
        // console.debug("next launcherUrlState time", nextProps.launcherUrlState.timeRange );
        // console.debug("current account", this.props.account);
        // console.debug("next account", nextProps.account);
        // console.debug("current compute", this.props.compute);
        // console.debug("next compute", nextProps.compute);
        // console.debug("current table config", this.props.tableConfig);
        // console.debug("next table config", nextProps.tableConfig);

        // console.debug("change detected ... ")
        await this.reload(nextProps.account, nextProps.app, nextProps.compute, nextProps.tableConfig, nextProps.launcherUrlState);
       return(true);
     } //if

    return(false);
  }//shouldComponentUpdate

  render() {

    if (this.state.tableData === null || this.state.tableData === undefined) {

      return(
      <div>
      <EmptyState
        heading="Please make a selection"
        description="Select a Service and Compute platform to see instance KPIs."
        buttonText="Service Instance Explorer Docs"
        buttonOnClick={() => {
        const url = 'https://github.com/newrelic-experimental/nr1-service-instance-explorer';
        window.open(url);
      }}
      />
      </div>
      );
      } // if
      else { 
        return (
          <div className="container-explorer">
            <div className="widget">
              <Grid
                className={`container-explorer-grid`}
                spacingType={[Grid.SPACING_TYPE.NONE, Grid.SPACING_TYPE.NONE]}
                >
                <GridItem columnSpan={12}>
                  <div>
                    <Table 
                      name="custom" 
                      cols={this.state.tableColumns} 
                      data={this.state.tableData} 
                      sort={this.sortTable}
                      pick={this.pickRow} />
                  </div> 
                </GridItem>
              </Grid>
            </div>
          </div>
        );
    } // else
  } // render
} // SIExplorerBody