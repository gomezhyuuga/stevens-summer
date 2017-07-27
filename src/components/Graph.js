import React from 'react'
import Colors from '../colors'
import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import cydagre from 'cytoscape-dagre'
import regCose from 'cytoscape-cose-bilkent'
import euler from 'cytoscape-euler'
import force from 'cytoscape-ngraph.forcelayout'
import spread from 'cytoscape-spread'
import jquery from 'jquery'
//import expandCollapse from 'cytoscape-expand-collapse'
import viewUtilities from 'cytoscape-view-utilities'

import Concentric from './layouts/Concentric'

import 'flag-icon-css/css/flag-icon.css'

import _ from 'lodash'

const UNHIGHLIGHT_OPACITY = 0.1;
const UNHIGHLIGHT_STYLE = {
  unhighlighted: {
    'opacity': UNHIGHLIGHT_OPACITY,
    'background-image-opacity': UNHIGHLIGHT_OPACITY,
  }
}

cytoscape.use(euler);
force(cytoscape);
spread(cytoscape);
regCose(cytoscape);
cycola (cytoscape);
//expandCollapse( cytoscape, jquery ); // register extension
cydagre(cytoscape);
viewUtilities(cytoscape, jquery);

class Graph extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    let { pages, visits, layout } = this.props;
    if (layout.name !== nextProps.layout.name) return true;
    return !(pages === nextProps.pages && visits === nextProps.visits);
  }
  toggleFlag() {
    this.cy.nodes('.visit').toggleClass('flag');
    console.log('toggling class');
  }
  query(q) {
    console.log(`Querying ${q}`);
    let vu = this.cy.viewUtilities();
    vu.removeHighlights();
    let eles = this.cy.nodes(q);
    vu.highlightNeighbors(eles);
  }
  getGraphData() {
    const { pages, visits } = this.props;
    let nodes = [];
    // Generate PAGE nodes
    for (let i = 0, l = pages.length; i < l; i++) {
      var p       = pages[i];
      let data    = Object.assign(p, { id: p.url });
      let classes = p.objective ? 'objective' : 'page';
      if (p.label === 'index') classes = `index ${classes}`;

      nodes.push({ data, classes });
    }
    const pageviewFilter = ({ type }) => type === 'action';
    // Generate VISIT nodes
    for (let i = 0, l = visits.length; i < l; i++) {
      var v = visits[i];
      let classes = 'visit';
      let data = Object.assign(v, { id: v.idVisit });

      nodes.push({ data, classes });

      // Generate EDGES
      _(v.actionDetails)
        .filter(pageviewFilter)
        .uniqBy('url')
        .forEach((p) => {
          const source = v.idVisit;
          const target = p.url;
          const timeSpent = +p.timeSpent || 0;
          const visitDuration = +v.visitDuration;
          let data = { source, target, timeSpent, visitDuration };

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
    let instance = cy.viewUtilities({
      node: UNHIGHLIGHT_STYLE,
      edge: UNHIGHLIGHT_STYLE
    });
    this.cy = cy;
    window.cy = cy;
    window.vu = instance;
    cy.on('tap', (e) => {
      if (!e.target.group) {
        instance.removeHighlights();
        this.props.onSelection(undefined);
      }
    });
    cy.elements().on('select', (e) => {
      let node = e.target;
      instance.removeHighlights();
      if (!node || node.size() === 0) return;
      instance.highlightNeighbors(node);
      //node.components()[0].select();
      this.props.onSelection(node);
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
  selectionType: 'additive',
  style: [
    {
      selector: 'node',
      css: {
        'background-color': Colors.BLUE,
        'border-width': '3px',
        'border-color': Colors.BROWN,
        //'content': 'data(id)',
        //'height': 70,
        //'width':  70,
      }
    },
    {
      selector: '.flag',
      css: {
        'background-image': ( node ) => {
          if (node.data().countryCode !== "") {
            let code = node.data().countryCode;
            return `flags/1x1/${code}.svg`.toLowerCase();
          }
        },
        'background-fit': 'cover cover',
      }
    },
    {
      selector: 'edge',
      css: {
        "curve-style": "bezier",
        //"curve-style": "haystack",
        //'haystack-radius': 0,
        "opacity": "0.8",
        "line-color": Colors.ORANGE,
        'width': 'mapData(visitDuration, 10, 180, 15, 2)',
        //'target-arrow-shape': 'triangle',
        //'target-arrow-color': Colors.ORANGE,
        //'target-arrow-fill':  'filled',
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
      }
    },
    {
      selector: '.visit',
      css: {
        'background-color': Colors.ORANGE,
        //'shape': 'rectangle',
        //'width': 50,
        //'height': 50
      }
    },
    {
      selector: '.objective',
      css: {
        'background-color': Colors.GREEN,
      }
    },
    {
      selector: '.index',
      css: {
        'background-color': Colors.BROWN
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

