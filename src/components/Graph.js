import _ from 'lodash';
import React from 'react';
import cytoscape from 'cytoscape';
import cycola from 'cytoscape-cola';
import regCose from 'cytoscape-cose-bilkent';
regCose(cytoscape);
cycola (cytoscape);

class Graph extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  componentDidUpdate() {
    if (!this.props.data || !this.container) {
      console.error('nowhere to mount');
      return;
    }
    let container = this.container;
    container.innerHTML = '';
    let elements  = this.props.data;
    let style     = this.props.style;
    let layout    = this.props.layout;
    let cy        = cytoscape({container, elements, style, layout});
    //cy.on('select', 'node', (e) => {
      //let node = cy.$('node:selected');
      //this.props.onSelection(node);
      //let t = document.getElementById('nodeDetails');
      //t.innerHTML = node.data().id;
    //});
  }
  componentDidMount() {
  }
  render() {
    return(
      <div ref={(div) => { this.container = div }}
        style={{
          minWidth: '400px',
          minHeight: '400px'
        }} />
    );
  }
}

Graph.defaultProps = {
  data: [],
  layout: {
      name: 'cose',
  },
  style: [
    {
      selector: 'node',
      css: {
        'background-color': '#2892D7',
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
        'width': '10',
        'color': '#000',
        'font-size': '2em',
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
      selector: '.visit',
      css: {
        'background-color': '#FF6542'
      }
    },
    {
      selector: '.objective',
      css: {
        'background-color': '#DBD56E',
      }
    }
  ],
}


export default Graph;

