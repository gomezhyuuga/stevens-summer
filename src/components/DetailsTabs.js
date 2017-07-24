import React from 'react'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Tab from 'react-toolbox/lib/tabs/Tab'
import ClickPath from './ClickPath'

class DetailsTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }
  tabChanged = (index) => {
    this.setState({ index });
  }
  render() {
    return (
      <section style={{
        backgroundColor: 'lavender',
        height: '100%'
      }}>
        <Tabs inverse fixed
          index={this.state.index}
          onChange={this.tabChanged}>
          <Tab label="Details">
            <h2>Web browser</h2>
          </Tab>
          <Tab label="Click Path">
            <ClickPath
              visit={this.props.visit}
              actions={this.props.actions} />
          </Tab>
        </Tabs>
      </section>
      );
  }
}

export default DetailsTabs;
