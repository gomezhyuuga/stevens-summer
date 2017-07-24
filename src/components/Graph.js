import React from 'react'
import Colors from '../colors'
import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import cydagre from 'cytoscape-dagre'
import regCose from 'cytoscape-cose-bilkent'
import jquery from 'jquery'
import expandCollapse from 'cytoscape-expand-collapse'
import viewUtilities from 'cytoscape-view-utilities'

import Concentric from './layouts/Concentric'


import _ from 'lodash'

regCose(cytoscape);
cycola (cytoscape);
//expandCollapse( cytoscape, jquery ); // register extension
cydagre(cytoscape);
viewUtilities(cytoscape, jquery);
let CY;
let VIEW_UTILS;

class Graph extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.pages === nextProps.pages
      && this.props.visits === nextProps.visits);
  }
  getGraphData() {
    const { pages, visits } = this.props;
    let nodes = [];
    // Generate PAGE nodes
    for (var i = 0, l = pages.length; i < l; i++) {
      var p       = pages[i];
      let data    = Object.assign(p, { id: p.url });
      let classes = p.objective ? 'objective' : 'page';

      nodes.push({ data, classes });
    }
    // Generate VISIT nodes
    for (var i = 0, l = visits.length; i < l; i++) {
      var v = visits[i];
      let classes = 'visit';
      let data = Object.assign(v, { id: v.idVisit });

      nodes.push({ data, classes });

      // Generate EDGES
      const pageview = ({ type }) => type === 'action';
      _(v.actionDetails)
        .filter(pageview)
        .uniqBy('url')
        .forEach((p) => {
          const source = v.idVisit;
          const target = p.url;
          let data = { source, target };

          nodes.push({ data });
        });
    }
    return nodes;
  }
  componentDidUpdate() {
    if (!this.props.pages || !this.container) {
      console.error('nowhere to mount');
      return;
    }
    let container = this.container;
    container.innerHTML = '';
    let elements  = this.getGraphData();
    let style     = this.props.style;
    let layout    = this.props.layout;
    let cy        = cytoscape({container, elements, style, layout });
    let instance = cy.viewUtilities();
    CY = cy;
    VIEW_UTILS = instance;
    window.cy = cy;
    window.vu = instance;
    //cy.expandCollapse({
      //undoable: false,
      //fisheye: false,
      //animate: false,
      ////layoutBy: {
        ////name: 'cose'
      ////}
    //});
    //var api = cy.expandCollapse('get');
    cy.elements().on('select', (e) => {
      instance.unhighlight(cy.elements());
      let node = e.target;
      if (!node || node.size() === 0) return;
      //node = node[0];
      instance.highlightNeighbors(node);
      //this.props.onSelection(node);
    });
  }
  componentDidMount() {
  }
  render() {
    console.log('rendering graph...');
    return(
      <div ref={(div) => { this.container = div }}
        style={{
          minWidth: '400px',
          minHeight: '400px',
          height: '100%',
        }} />
    );
  }
}

Graph.defaultProps = {
  data: [],
  layout: Concentric,
  style: [
    {
      selector: 'node',
      css: {
        'background-color': Colors.BLUE,
        'border-width': '3px',
        'border-color': Colors.BROWN,
        //'content': 'data(id)',
        'height': 70,
        'width':  70,
      }
    },
    {
      selector: 'edge',
      css: {
        "curve-style": "bezier",
        "opacity": "0.8",
        "line-color": Colors.ORANGE,
        'width': 10,
        'target-arrow-shape': 'triangle',
        'target-arrow-color': Colors.ORANGE,
        'target-arrow-fill':  'filled',
      }
    },
    {
      selector: '.page',
      css: {
        'width': 'mapData(visits, 0, 500, 20, 100)',
        'height': 'mapData(visits, 0, 500, 20, 100)',
        'background-color': Colors.BLUE,
        'color': '#FFF',
        //'label': 'data(label)',
        "text-outline-color": "#333",
        "text-opacity": 1,
        "text-outline-width": 2,
        'font-family': "Roboto, sans-serif",
        'font-weight': 'bold',
        "text-valign": "top",
        "text-halign": "center",
        width:  'mapData(nb_visits, 0, 800, 30, 90)',
        height: 'mapData(nb_visits, 0, 800, 30, 90)',
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
    },
    {
      selector: ':selected',
      css: {
        'border-color': '#FF3636',
      }
    }
  ],
}


export default Graph;

