import React, { Component } from 'react'
import  './assets/react-toolbox/theme.css'
import './App.css';

import _ from 'lodash'
import theme from './assets/react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import IconButton from 'react-toolbox/lib/button/IconButton'
import Button from 'react-toolbox/lib/button/Button'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Layout from 'react-toolbox/lib/layout/Layout'
import NavDrawer from 'react-toolbox/lib/drawer/Drawer'
import Panel from 'react-toolbox/lib/layout/Panel'
import Sidebar  from 'react-toolbox/lib/layout/Sidebar'

import VisitStore from './stores/VisitStore'
import * as VisitActions from './actions'

import Graph from './components/Graph'

class App extends Component {
  state = {
    showSidebar: false,
    pages: []
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
    VisitActions.getInitialData();
  }

  getMainGraphData() {
    return _(this.state.pages)
      .map((page) => {
        return {
          data: {
            id: page.url,
            label: page.label,
            views: page.nb_hits,
            visits: page.nb_visits
          },
          classes: 'page'
        }
      })
      .concat(_.map(this.state.visits, (visit) => {
        return {
          classes: 'visit',
          data: {
            id: visit.idVisit,
            visitor: visit.visitorId,
            actions: visit.actions,
            timestamp: visit.serverTimestamp
          }
        }
      })) .value();
  }

  render() {
    console.log('Rendering...');
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
            <div className="flex1" style={{
              flexGrow: 1,
            }} >
              <Graph container="main-graph" data={this.getMainGraphData()} />
            </div>
          </Panel>
          <Sidebar pinned={this.state.showSidebar} width={10}>
            <h1>
              Navigation flow
              <IconButton icon='close' onClick={this.toggleSidebar} />
            </h1>
            <div className="flex1">
              Hello
            </div>
          </Sidebar>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default App;
