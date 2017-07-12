import React from 'react'
import Colors from '../colors'
import cytoscape from 'cytoscape'
import cycola from 'cytoscape-cola'
import regCose from 'cytoscape-cose-bilkent'
import jquery from 'jquery'
import expandCollapse from 'cytoscape-expand-collapse'

import _ from 'lodash'

regCose(cytoscape);
cycola (cytoscape);
//expandCollapse( cytoscape, jquery ); // register extension

class Graph extends React.PureComponent {
  shouldComponentUpdate(nextProps, nextState) {
    return !(this.props.pages === nextProps.pages
      && this.props.visits === nextProps.visits);
  }
  objective(page) {
    switch (page.label) {
      case 'index':
      case 'jsf/careers/career_opportunities.html':
      case 'jsf/auth/login/login.html':
      case 'jsf/static_content/contactb64c.html':
      case 'jsf/user_abc/register/registerForm.html':
        return true;
      default:
        return false;
    }
  }
  getMainGraphData() {
    let aa = _(this.props.pages)
      .flatMap((page ) => {
        return {
          data: {
            id: page.url,
            url: page.url,
            label: page.label.split("/").pop(),
            views: page.nb_hits,
            visits: page.nb_visits,
          },
          classes: this.objective(page) ? 'objective' : 'page'
        }
      })
      .concat(_.flatMap(this.props.visits, (visit) => {
        let visitNode = {
          classes: 'visit',
          data: {
            id: visit.idVisit,
            visitor: visit.visitorId,
            actions: visit.actionDetails,
            timestamp: visit.serverTimestamp
          }
        }
        let nodes = _(visit.actionDetails)
          .filter(action => action.type === 'action' )
          .flatMap(action => {
            return [{
              data: {
                //parent: visit.idVisit,
                url: action.url,
                timestamp: action.timestamp,
                timeSpent: action.timeSpent,
              },
              classes: 'pageview'
            }, {
              data: {
                source: visit.idVisit,
                target: action.url || ""
              }
            }]
          }).value();
        nodes.push(visitNode);
        return nodes;
      })).value();
    return aa;
  }
  componentDidUpdate() {
    if (!this.props.pages || !this.container) {
      console.error('nowhere to mount');
      return;
    }
    let container = this.container;
    container.innerHTML = '';
    let elements  = this.getMainGraphData();
    let style     = this.props.style;
    let layout    = this.props.layout;
    let cy        = cytoscape({container, elements, style, layout,
      zoom: 0.4,
    });
    window.cy = cy;
    //cy.expandCollapse({
      //undoable: false,
      //fisheye: false,
      //animate: false,
      ////layoutBy: {
        ////name: 'cose'
      ////}
    //});
    //var api = cy.expandCollapse('get');
    //cy.on('layoutstop', () => {
      //console.log('collapsing');
      //api.collapseAll();
    //});
    cy.elements().on('select', (e) => {
      let node = cy.$(':selected');
      this.props.onSelection(node);
      window.snode = node;
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
    name: 'cose-bilkent',
    //concentric: (ele) => ele.hasClass('objective') ? 10 : 2,
    //spacingFactor: 1
  },
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
        //"curve-style": "haystack",
        //"haystack-radius": "1.0",
        "opacity": "0.8",
        'label': 'data(label)',
        "line-color": "#FF6542",
        'width': '5',
        'color': '#000',
        'target-arrow-shape': 'triangle',
        'curve-style': 'bezier',
        'target-arrow-color': '#FF6542',
        'target-arrow-fill':  'filled',
      }
    },
    {
      selector: '.page',
      css: {
        'width': 'mapData(visits, 0, 100, 60, 100)',
        'height': 'mapData(visits, 0, 100, 60, 100)',
        'background-color': Colors.BLUE,
        'color': '#FFF',
        'label': 'data(label)',
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

