import React from 'react';
import PropTypes from 'prop-types';

import { Button, Checkbox, Grid, GridItem, HeadingText, Spinner } from 'nr1';



export default class TableConfigForm extends React.Component {

  static propTypes = {
    tableConfig: PropTypes.array,
    setTableConfig: PropTypes.func
  };

  constructor(props) {
    super(props);
  
    this.state = {
      tableConfig: null
    };
    
    this.updateTableConfig = this._updateTableConfig.bind(this);
  } //constructor

  async _loadTableConfig() {

    if (this.props.tableConfig !== null && this.props.tableConfig !== undefined) {

      await this.setState({ tableConfig: this.props.tableConfig });
    } //if

  } // _loadTableConfig

  async _updateTableConfig(_event) {

    console.debug(_event)
  } // updateTableConfig

  componentDidMount() {

    this._loadTableConfig();
  } // componentDidMount

  render() {

    if (this.state.tableConfig === null || this.state.tableConfig === undefined) {

      return(
        <Spinner/>
      );
    } // if
    else { 
      return (

        <div className="table-column-picker">
          <Grid>
            <GridItem columnSpan={9}>
              <HeadingText type={HeadingText.TYPE.HEADING_4}>Select the columns you would like to view</HeadingText>
            </GridItem>
          </Grid>
          <br/>
          {            
            this.state.tableConfig.map((__column) => {
              return (
                <Grid>
                  <GridItem columnSpan={9}>
                    <Checkbox checked={__column.enabled} onChange={(event) => this.updateTableConfig(event.nativeEvent)} label={__column.title} key={__column.reference}/>
                  </GridItem>
                </Grid> 
              )
            })}
          <br/>
          <Grid>
            <GridItem columnSpan={9}>
              <Button
                onClick={() => this.props.setTableConfig(this.state.tableConfig)}
                type={Button.TYPE.PRIMARY}
              >
                Apply
              </Button>
            </GridItem>
          </Grid>
        </div>
      );
    } // else

  } // render
} // TableConfigForm