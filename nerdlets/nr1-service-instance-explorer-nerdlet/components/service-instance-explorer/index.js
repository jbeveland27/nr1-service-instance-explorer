/**
 * Provides the component context for the Service Instance Explorer.
 *
 * @file This files defines the Service Instance Explorer and all root state elements
 * @author Gil Rice
 */
/** core */
import React from 'react';
import { Modal, PlatformStateContext, Spinner } from 'nr1';


import nrdbQuery from '../../../lib/nrdb-query';
import findAccounts from '../../../lib/find-accounts';
import accountAppList from '../../../lib/account-app-list';

/** nr1 */


/** nr1 community */
import { EmptyState } from '@newrelic/nr1-community';

/** local */
import SIExplorerBody from './sie-body';
import SIExplorerHeader from './sie-header';
import TableConfigForm from './table-config-form';
import TableColumns from '../../../conf/table-columns';

/** 3rd party */


export default class ServiceInstanceExplorer extends React.Component {
  constructor(props) {
    super(props);

    this.setAccount = this.setAccount.bind(this);
    this.setApp = this.setApp.bind(this);
    this.setCompute = this.setCompute.bind(this);
    this.setTableConfig = this.setTableConfig.bind(this);
    this.toggleTableConfig = this.toggleTableConfig.bind(this);
    
    this.state = {
    
        isActiveCreateModal: false,
        isActiveUpdateModal: false,
        isActiveViewModal: false,
        tableConfig: null
    };

 
  }

  async toggleTableConfig() {

console.debug("open the modal bay door hal");
    
    this.setState(prevState => ({
        isActiveCreateModal: !prevState.isActiveCreateModal
    }));
      
  } // openTableConfig

  async setAccount(account) {
    await this.setState({ account });
    const apps = await accountAppList(this.state.account, this.state.compute, this.props.launcherUrlState);
    await this.setState({ apps, app: apps[0] }); //set the available app context
  } // setAccoutn

  async setApp(app) {    
    await this.setState({ app });
  } // setApp

  async setCompute(_compute) {
    await this.setState({ compute: _compute });
    const apps = await accountAppList(this.state.account, _compute, this.props.launcherUrlState);
    await this.setState({ apps, app: apps[0] }); //set the available app context
  } // setCompute

  async setTableConfig(_tableConfig) {
console.debug("passing table config what?", _tableConfig);
    if (_tableConfig !== null && _tableConfig !== undefined) {
        await this.setState({ tableConfig: _tableConfig});
    } // if
  } // setTableConfig
  
  async componentDidMount() {
    
    const find = {
      eventType: 'Transaction',
      where: 'appName IS NOT NULL',
      timeWindow: 'SINCE 60 minutes ago',
    };
    const accounts = await findAccounts(find);
    
    if (accounts.length > 0) {
        //get the initial list of apps
        const apps = await accountAppList(accounts[0], "containerId", this.props.launcherUrlState);
        await this.setState({ compute: "containerId" }); //sett he inital state context to match the radio button
        await this.setState({ apps, app: apps[0] }); //set the available app context
        await this.setTableConfig(TableColumns); //need to add a fucntion that looks up the local state overrides of this - for now just adding the template
        // it would also be good to have a way of adding new column definitions ... need to place that somewhere ... 
    } // if

    await this.setState({ accounts, account: accounts[0] });
  } // componentDidMount

  render() {
    const { account, counts, accounts, apps, app } = this.state; 

    if (!accounts) {
      return <Spinner />;
    }

    if (accounts.length === 0) {
      return (
        <EmptyState
          heading="No Data"
          description="Could not find any accounts with reporting services."
          buttonText="Install New Relic APM and Infrastructure today!"
          buttonOnClick={() => {
            const url = 'https://newrelic.com/products/infrastructure';
            window.open(url);
          }}
        />
      );
    } // if

    return (
      <PlatformStateContext.Consumer>
        {platformUrlState => {
          return(
            <div style={{ height: '100%' }}>
              <SIExplorerHeader
                {...this.state}
                setAccount={this.setAccount}
                setApp={this.setApp}
                setCompute={this.setCompute}
                toggleTableConfig={this.toggleTableConfig}
                timeRange={platformUrlState.timeRange}

              />
              <br/>
                <SIExplorerBody
                  launcherUrlState={this.props.launcherUrlState}
                  account={this.state.account}
                  app={this.state.app}
                  tableConfig={this.state.tableConfig}
                  compute={this.state.compute}
                />
              
                {/* Create Modal */}
                <Modal
                    hidden={!this.state.isActiveCreateModal}
                    onClose={() => this.setState({ isActiveCreateModal: false })}
                >
                  <PlatformStateContext.Consumer>
                    {platformUrlState => {
                      return (
                        <TableConfigForm
                          entityGuid={this.state.entityGuid}
                          setTableConfigCallback={this.setTableConfig}
                          modalToggleCallback={this.toggleTableConfig}
                          tableConfig={this.state.tableConfig}
                          setTableConfig={this.setTableConfig}
                        />
                      );
                    }}
                  </PlatformStateContext.Consumer>
                </Modal>
            </div>
          )
        }}
      </PlatformStateContext.Consumer>
    );
  }
}