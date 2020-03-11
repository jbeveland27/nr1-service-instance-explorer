import nrdbQuery from "./nrdb-query";
import { timeRangeToNrql } from '@newrelic/nr1-community';

/**
 * get the list of apps reporting for this time period and currently selected account.
 */
export default async function accountAppList(_account, _compute, _launcherUrlState) {

  /* might want to me more conscience of the timerange here */
  var __nrql_timerange = timeRangeToNrql(_launcherUrlState);
  var __nrql;

  if (_compute === "containerId") {
    
    __nrql = `SELECT uniques(appName) FROM Transaction where containerId IS NOT NULL ${__nrql_timerange} LIMIT MAX`;
  } //if
  else {

    __nrql = `SELECT uniques(appName) FROM Transaction WHERE containerId IS NULL and host IS NOT NULL ${__nrql_timerange} LIMIT MAX`;
  } //else

  var __results = await nrdbQuery(_account.id, __nrql);
  var __adjusted_results = __results[0]["uniques.appName"].sort();

  /* one thing to consider here is the compute we want to map might not be in the same account they we are root selecting for the
  app list ... so we might want to have an option to look more expansively at all the compute resourcs that match our app context */

  //adding the "All" option to the list of apps for the default view.
  if (__adjusted_results.length === 0) {
    __adjusted_results.unshift("No Apps Available");
  } // if
  else {
    __adjusted_results.unshift("All");
  } // else

  
  return(__adjusted_results);
} //accountAppList