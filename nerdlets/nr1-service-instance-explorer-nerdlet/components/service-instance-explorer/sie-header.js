import { Button, Radio, RadioGroup, Spinner, Stack, StackItem, Dropdown, DropdownItem } from 'nr1';

function AccountPicker({ accounts, account, setAccount }) {
  return (
    <Dropdown className="account-picker" label="Account" title={account.name}>
      {accounts.map(account => {
        return (
          <DropdownItem onClick={() => setAccount(account)} key={account.id}>
            {account.name}
          </DropdownItem>
        );
      })}
    </Dropdown>
  );
}

function AppPicker({ apps, app, setApp }) {

  if ( apps === undefined ) {
    return (
      <Spinner/>
    );
  } //if
  else {
    return(
      <Dropdown className="app-picker" label="Service" title={app}>
        {apps.map(_app => {
  
          return(
            <DropdownItem onClick={() => setApp(_app)} key={_app}>
                {_app}
            </DropdownItem>
          );
        })}
      </Dropdown>
    );
  }
} //AppPicker

function ComputePicker({ setCompute }) {

    // TODO STYLE ME!!!
  return(
    <div>
      <RadioGroup defaultValue="containerId" onChange={event => setCompute(event.nativeEvent.target.value)}>
        <Radio label="Container deployed" value="containerId" />
        <Radio label="Host/VM deployed" value="entityName" />
      </RadioGroup>
    </div>
  );
} //ComputePicker

function NRQLTableConfig( { toggleTableConfig }) {

    return (
        <div>
            <Button 
                type={Button.TYPE.PRIMARY}
                onClick={() => toggleTableConfig()}
                iconType={Button.ICON_TYPE.INTERFACE__OPERATIONS__CONFIGURE}/>
        </div>
    );
} // NRQLTableConfig

export default function SIExplorerHeader(props) {
  
  return (
    <div className="header">
      <Stack
        fullWidth
        className="options-bar"
        verticalType={Stack.VERTICAL_TYPE.CENTER}
      >
        <StackItem>
          <Stack verticalType={Stack.VERTICAL_TYPE.CENTER}>
            <StackItem>
              <AccountPicker {...props} />
            </StackItem>
            <StackItem>
              <AppPicker {...props}/>
            </StackItem>
            <StackItem className="plot-picker-stack-item">
              <ComputePicker {...props}></ComputePicker>
            </StackItem>
          </Stack>
        </StackItem>
        <StackItem className="header-right-side">
          <Stack verticalType={Stack.VERTICAL_TYPE.CENTER}>
              <StackItem>
                <NRQLTableConfig {...props}></NRQLTableConfig>
              </StackItem>
          </Stack>
        </StackItem>
      </Stack>
    </div>
  );
}
