import React from 'react'
import Colors from '../colors'
import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import regCose from 'cytoscape-cose-bilkent'
import jquery from 'jquery'

import _ from 'lodash'

regCose(cytoscape);
cycola (cytoscape);

class ClickPath extends React.PureComponent {
  //shouldComponentUpdate(nextProps, nextState) {
    //return !(this.props.pages === nextProps.pages
      //&& this.props.visits === nextProps.visits);
  //}
  getGraphData() {
    const actions = this.props.actions;
    const visit   = this.props.visit;
    if (!actions) return;
    console.log('generated');

    let nodes = [];
    nodes.push({
      data: visit,
      classes: 'visit'
    });
    nodes.push({
      data: { source: visit.id, target: actions[0].url, label: 'START' }
    });
    // Append al pages nodes
    nodes = nodes.concat(_.map(actions, (action) => {
      const { timestamp, timeSpent, url } = action;
      return {
        data: { id: url, url, timestamp, timeSpent},
        classes: 'page'
      }
    }));
    // Create edges
    for (var i = 0, l = actions.length; i < l - 1; i++) {
      const action = actions[i];
      const source = actions[i].url;
      const target = actions[i + 1].url;
      const label  = i == l - 1 ? 'END' : i + 1;
      nodes.push({
        data: { source, target, label }
      });
    }

    return nodes;
  }
  componentDidMount() {
    console.log('MOUNTING');
    if (!this.props.actions || !this.container) {
      console.error('nowhere to mount');
      return;
    }
    let container = this.container;
    container.innerHTML = '';
    let elements  = this.getGraphData();
    let style     = this.props.style;
    let layout    = this.props.layout;
    console.log('ELEMENTS ', elements);
    let cy        = cytoscape({container, elements, style, layout});
    cy.on('layoutstop', () => {
      console.log('collapsing');
      //api.collapseAll();
    });
    //cy.on('select', 'node', (e) => {
      //let node = cy.$('node:selected');
      //this.props.onSelection(node);
      //window.snode = node;
    //});
  }
  render() {
    console.log('rendering clickpath...');
    return(
      <div ref={(div) => { this.container = div }}
        style={{
          minWidth: '400px',
          minHeight: '400px',
        }} />
    );
  }
}

ClickPath.defaultProps = {
  data: [],
  layout: {
    name: 'cose-bilkent',
    //concentric: (ele) => ele.hasClass('visit') ? 10 : 2,
    //spacingFactor: 10
  },
  style: [
    {
      selector: 'node',
      css: {
        'background-color': Colors.BLUE,
        'border-width': '3px',
        'border-color': '#564154',
        //'content': 'data(id)',
        'height': 70,
        'width':  70,
      }
    },
    {
      selector: 'edge',
      css: {
        //"curve-style": "haystack",
        //"haystack-radius": "1.0",
        "opacity": "0.8",
        'label': 'data(label)',
        "line-color": "#FF6542",
        //'width': '10',
        //'color': '#000',
        //'font-size': '2em',
        'font-weight': 'bold',
        //"width": "mapData(weight, 0, 1, 1, 8)",
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        //'mid-target-arrow-shape': 'triangle',
        'target-arrow-color': '#FF6542',
        //'mid-target-arrow-color': '#FF6542',
        'target-arrow-fill':  'filled',
        //'source-arrow-shape': 'circle',
      }
    },
    {
      selector: '.collapsed-child',
      css: {
        'display': 'none',
        'opacity': '0'
      }
    },
    {
      selector: '.page',
      css: {
        'width': 'mapData(visits, 0, 100, 30, 100)',
        'height': 'mapData(visits, 0, 100, 30, 100)',
        'background-color': Colors.BLUE,
      }
    },
    {
      selector: '.visit',
      css: {
        'background-color': Colors.ORANGE,
        'width': 50,
        'height': 50
      }
    },
    {
      selector: '.objective',
      css: {
        'background-color': Colors.GREEN,
      }
    }
  ],
}


export default ClickPath;


