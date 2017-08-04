import React from 'react'
import Tabs from 'react-toolbox/lib/tabs/Tabs'
import Dropdown from 'react-toolbox/lib/dropdown/Dropdown'
import List from 'react-toolbox/lib/list/List'
//import ListItem from 'react-toolbox/lib/list/ListItem'
import ListCheckbox from 'react-toolbox/lib/list/ListCheckbox'
import Tab from 'react-toolbox/lib/tabs/Tab'
import ClickPath from './ClickPath'
import JSONTree from 'react-json-tree'
import { VictoryChart, VictoryBar } from 'victory'
import _ from 'lodash'

const LAYOUTS = [
  { value: 'cola', label: "Cola" },
  { value: 'concentric', label: "Concentric" },
  { value: 'cose', label: "Cose" },
  { value: 'cose-bilkent', label: "Cose Bilkent" },
  { value: 'random', label: "Random" },
  { value: 'spread', label: "Spread" },
  { value: 'grid', label: "Grid" },
];

class DetailsTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      xattr: '',
      yattr: '',
    };
  }
  tabChanged = (index) => {
    this.setState({ index });
  }
  changeLayout = (layout) => {
    this.props.onOptionsChange(layout);
  }
  updateX = (xattr) => {
    this.setState( { xattr });
  }
  updateY = (yattr) => {
    this.setState( { yattr });
  }

  render() {
    console.log('rendering details');
    let selection = this.props.selection;
    let keys      = this.props.data.length > 0 ? Object.keys(this.props.data[0]) : [];
    keys = _(keys)
      .map(k => ({ value: k, label: _.capitalize(k) }))
      .sortBy('value').value();

    let { xattr, yattr } = this.state;
    return (
      <section style={{
        height: '100%'
      }}>
        <Tabs inverse fixed
          index={this.state.index}
          onChange={this.tabChanged}>
          <Tab label="Plot">
            <Dropdown
              auto
              label="X Axis"
              onChange={this.updateX}
              source={keys}
              value={xattr} />
            <Dropdown
              auto
              label="Y Axis"
              onChange={this.updateY}
              source={keys}
              value={yattr} />
            { (xattr && yattr) ?
                <VictoryChart>
                  <VictoryBar
                    data={this.props.data}
                    x={xattr}
                    y={yattr} />
                </VictoryChart>
                : ''
            }
          </Tab>
          <Tab label="Options">
            <Dropdown
              auto
              label="Layout"
              onChange={this.changeLayout}
              source={LAYOUTS}
              value={this.props.options.layout.name}
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
DetailsTabs.defaultProps = {
  data: [ {} ]
}

export default DetailsTabs;
