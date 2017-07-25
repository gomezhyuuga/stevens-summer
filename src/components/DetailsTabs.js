import React from 'react'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import ClickPath from './ClickPath'
import JSONTree from 'react-json-tree'

class DetailsTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }
  tabChanged = (index) => {
    this.setState({ index });
  }
  render() {
    let selection = this.props.selection;
    return (
      <section style={{
        backgroundColor: 'lavender',
        height: '100%'
      }}>
        <Tabs inverse fixed
          index={this.state.index}
          onChange={this.tabChanged}>
          <Tab label="Click Path">
            { selection ?
            <ClickPath
              visit={this.props.visit}
              actions={this.props.actions} />
                : "Select something" }
          </Tab>
          <Tab label="Details">
            { selection ? <JSONTree data={selection.data()} /> : "Select something" }
          </Tab>
        </Tabs>
      </section>
      );
  }
}

export default DetailsTabs;
