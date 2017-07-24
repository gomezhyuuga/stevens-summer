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
import ClickPath from './components/ClickPath'

class App extends Component {
  state = {
    showSidebar: false,
    pages: [],
    startDate: moment('2017-06-05'),
    endDate: moment('2017-06-07')
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
    this.setState({ showSidebar: true, selectedNode: node });
    //let el = renderjson(node.data());
    //this.infolog.appendChild(el);
  }

  render() {
    console.log('Rendering...');
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
    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Panel style={{
            display: 'flex',
            flexFlow: 'column',
            height: '100%',
          }}>
            <AppBar title="Web visualization">
              <Button raised accent
                label="Details"
                icon="group_work"
                onClick={ this.toggleSidebar }/>
            </AppBar>
            <div className="filters">
              <DatePicker label="Desde"
                className="dt"
                value={this.state.startDate.toDate()}
                onChange={this.handleDateChange.bind(this, 'start')}
                autoOk />
              <DatePicker label="Hasta"
                className="dt"
                value={this.state.startDate.toDate()}
                value={this.state.endDate.toDate()}
                onChange={this.handleDateChange.bind(this, 'end')}
                autoOk />
              <div className="query">
                <span className="attr">browser</span>
                <span className="operator">==</span>
                <span className="value">"Firefox"</span>
                <span className="operator">&&</span>
                <span className="attr">os</span>
                <span className="operator">==</span>
                <span className="value">"Windows"</span>
                <span className="operator">&&</span>
                <span className="attr">os</span>
                <span className="operator">==</span>
                <span className="value">"Windows"</span>
              </div>
            </div>
            <div className="flex1" style={{
              //flexGrow: 1,
              padding: '0 0 4em 0',
              border: '1px solid rgba(0, 0, 0, 0.4)',
              height: '80%'
            }} >
            <Graph container="main-graph"
              pages={VisitStore.pages}
              visits={VisitStore.visits}
              onSelection={this.nodeSelected.bind(this)} />
          </div>
          <section>
            <Snackbar active
              label={ label }
              ref='snackbar'
            />
          </section>
        </Panel>
        <Sidebar pinned={this.state.showSidebar} width={10}>
          <h1>
            Navigation flow
            <IconButton icon='close' onClick={this.toggleSidebar} />
          </h1>
          { selected && selected.hasClass('visit') ? (
          <ClickPath
            visit={ selected.data() }
            actions={ _.filter(selected.data().actionDetails, ({type}) => type === 'action') } />
          ) : '' }
        </Sidebar>
      </Layout>
    </ThemeProvider>
    );
  }
}

export default App;
