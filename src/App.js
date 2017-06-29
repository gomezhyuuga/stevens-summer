import React, { Component } from 'react'
import  './assets/react-toolbox/theme.css'
import './App.css';

import theme from './assets/react-toolbox/theme'
import ThemeProvider from 'react-toolbox/lib/ThemeProvider'
import IconButton from 'react-toolbox/lib/button/IconButton'
import Button from 'react-toolbox/lib/button/Button'
import AppBar from 'react-toolbox/lib/app_bar/AppBar'
import Layout from 'react-toolbox/lib/layout/Layout';
import NavDrawer from 'react-toolbox/lib/drawer/Drawer';
import Panel from 'react-toolbox/lib/layout/Panel';
import Sidebar  from 'react-toolbox/lib/layout/Sidebar';

class App extends Component {
  state = {
    showSidebar: true
  }

  toggleSidebar = () => {
    this.setState({ showSidebar: !this.state.showSidebar });
  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <Layout>
          <Panel>
            <AppBar title="Web visualization" />
            <div className="flex1">
              <Button label="Open sidebar" raised primary
                onClick={ this.toggleSidebar }/>
            </div>
          </Panel>
          <Sidebar pinned={this.state.showSidebar} width={10}>
            <h1>
              Navigation flow
              <IconButton icon='close' onClick={this.toggleSidebar} />
            </h1>
            <div className="flex1">
            </div>
          </Sidebar>
        </Layout>
      </ThemeProvider>
    );
  }
}

export default App;
