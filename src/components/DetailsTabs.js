import React from 'react'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import List from 'react-toolbox/lib/list/List'
import ListItem from 'react-toolbox/lib/list/ListItem'
import ListCheckbox from 'react-toolbox/lib/list/ListCheckbox'
import Tab from 'react-toolbox/lib/tabs/Tab'
import ClickPath from './ClickPath'
import JSONTree from 'react-json-tree'

const LAYOUTS = [
  { value: 'cola', label: "Cola" },
  { value: 'cose', label: "Cose" },
  { value: 'cose-bilkent', label: "Cose Bilkent" },
  { value: 'random', label: "Random" },
  { value: 'spread', label: "Spread" },
  { value: 'grid', label: "Grid" },
];

class DetailsTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = { index: 0 };
  }
  tabChanged = (index) => {
    this.setState({ index });
  }
  changeLayout = (layout) => {
    this.props.onOptionsChange({ layout });
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
          <Tab label="Options">
            <Dropdown
              auto
              label="Layout"
              onChange={this.changeLayout}
              source={LAYOUTS}
              value={this.props.options.layout}
            />
            <List selectable>
              <ListCheckbox
                checked={this.props.showFlag}
                onChange={this.props.onToggleFlag}
                caption='Background Flag'
                legend='Show country flag as background' />
            </List>
          </Tab>
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
