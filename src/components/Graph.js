import React from 'react'
import Colors from '../colors'
import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import regCose from 'cytoscape-cose-bilkent'
import _ from 'lodash'

regCose(cytoscape);
cycola (cytoscape);

class Graph extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.pages === nextProps.pages
      && this.props.visits === nextProps.visits);
  }
  getMainGraphData() {
    return _(this.props.pages)
      .map((page) => {
        return {
          data: {
            id: page.url,
            label: page.label,
            views: page.nb_hits,
            visits: page.nb_visits,
          },
          classes: 'page'
        }
      })
      .concat(_.map(this.props.visits, (visit) => {
        return {
          classes: 'visit',
          data: {
            id: visit.idVisit,
            visitor: visit.visitorId,
            actions: visit.actions,
            timestamp: visit.serverTimestamp
          }
        }
      })).value();
  }
  componentDidUpdate() {
    if (!this.props.data || !this.container) {
      console.error('nowhere to mount');
      return;
    }
    let container = this.container;
    container.innerHTML = '';
    let elements  = this.getMainGraphData();
    let style     = this.props.style;
    let layout    = this.props.layout;
    let cy        = cytoscape({container, elements, style, layout});
    cy.on('select', 'node', (e) => {
      let node = cy.$('node:selected');
      this.props.onSelection(node);
      //let t = document.getElementById('nodeDetails');
      //t.innerHTML = node.data().id;
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
  layout: {
    name: 'cose',
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
        'width': '10',
        'color': '#000',
        'font-size': '2em',
        'font-weight': 'bold',
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
      selector: '.page',
      css: {
        'width': 'mapData(visits, 0, 100, 10, 80)',
        'height': 'mapData(visits, 0, 100, 10, 80)',
        'background-color': `mapData(visits, 0, 50, ${Colors.BLUE}, #DBD56E)`
      }
    },
    {
      selector: '.visit',
      css: {
        'background-color': Colors.ORANGE
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


export default Graph;

