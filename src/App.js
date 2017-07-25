import React, { Component } from 'react'
import moment from 'moment'
import renderjson from 'renderjson'
import  './assets/react-toolbox/theme.css'
import './App.css';

import _ from 'lodash'
import theme from './assets/react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import IconButton from 'react-toolbox/lib/button/IconButton'
import Button from 'react-toolbox/lib/button/Button'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Layout from 'react-toolbox/lib/layout/Layout'
import Snackbar from 'react-toolbox/lib/snackbar/Snackbar'
//import NavDrawer from 'react-toolbox/lib/drawer/Drawer'
import Panel from 'react-toolbox/lib/layout/Panel'
import Sidebar  from 'react-toolbox/lib/layout/Sidebar'
import DatePicker from 'react-toolbox/lib/date_picker/DatePicker'

import VisitStore from './stores/VisitStore'
import * as VisitActions from './actions'

import Graph from './components/Graph'
import DetailsTabs from './components/DetailsTabs'
import Query from './components/Query'

class App extends Component {
  state = {
    showSidebar: false,
    pages: [],
    startDate: moment('2017-06-05'),
    endDate: moment('2017-06-06')
  }

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  }

  componentWillMount() {
    VisitStore.on('change', (ev) => {
      this.setState({
        updated: true,
        pages: VisitStore.getPages(),
        visits: VisitStore.getVisits()
      });
    });
    //VisitStore.removeListener();
    const { startDate, endDate } = this.state;
    VisitActions.getInitialData({
      startDate,
      endDate
    });
  }
  handleDateChange = (item, value) => {
    let { startDate, endDate } = this.state;
    if (item === 'start') {
      startDate = moment(value);
      this.setState({ startDate });
    }
    else {
      endDate = moment(value);
      this.setState({ endDate });
    }
    VisitActions.getVisits({ startDate, endDate });
  }

  nodeSelected(node) {
    this.setState({ selectedNode: node });
  }
  queryData(query) {
    this._graph.query(query);
  }

  render() {
    console.log('Rendering Main App...');
    let label;
    let selected = this.state.selectedNode;
    if (selected) {
      const ndata = selected.data();
      let prefix;
      if (selected.hasClass('visit')) prefix = "VISITOR";
      else prefix = "URL";
      label = selected.hasClass('visit') ? ndata.visitor : ndata.url;
      label = `${prefix}: ${label}`;
    }
    let clickPath = '';
    let actions = [];
    let visit = '';
    if (selected && selected.hasClass('visit')) {
      actions = _.filter(selected.data().actionDetails, ({type}) => type === 'action');
      visit = selected.data();
    }

    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Panel style={{
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
          }}>
            <AppBar title="Web visualization">
              <DatePicker label="Desde"
                className="dt"
                inputClassName="inputDT"
                value={this.state.startDate.toDate()}
                onChange={this.handleDateChange.bind(this, 'start')}
                autoOk />
              <DatePicker label="Hasta"
                className="dt"
                inputClassName="inputDT"
                value={this.state.startDate.toDate()}
                value={this.state.endDate.toDate()}
                onChange={this.handleDateChange.bind(this, 'end')}
                autoOk />
            </AppBar>
            <div className="filters">
              <Query onQuery={this.queryData.bind(this)} />
            </div>
            <div className="flex1" style={{
              //flexGrow: 1,
              padding: '0 0 4em 0',
              border: '1px solid rgba(0, 0, 0, 0.4)',
              height: '80%'
            }} >
            <Graph container="main-graph"
              ref={ (c) => this._graph = c }
              pages={VisitStore.pages}
              visits={VisitStore.visits}
              onSelection={this.nodeSelected.bind(this)} />
          </div>
        </Panel>
        <Sidebar pinned width={8}>
          <DetailsTabs
            clickPath={clickPath}
            actions={actions}
            visit={visit}
          />
        </Sidebar>
      </Layout>
    </ThemeProvider>
    );
  }
}

export default App;
