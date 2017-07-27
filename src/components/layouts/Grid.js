export default {
  name: 'grid',
  fit: true, // whether to fit the viewport to the graph
  //padding: 30, // padding used on fit
  //boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  //avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  //avoidOverlapPadding: 10, // extra spacing around nodes when avoidOverlap: true
  //nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  //spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  //condense: false, // uses all available space on false, uses minimal space on true
  //rows: undefined, // force num of rows in the grid
  //cols: undefined, // force num of columns in the grid
  ////position: function( node ){}, // returns { row, col } for element
  sort: (a, b) => {
    if (a.hasClass('visit') && b.hasClass('visit'))
      return a.data('countryCode').localeCompare(b.data('countryCode'));
    // a sorting function to order the nodes;
    // e.g. function(a, b){ return a.data('weight') - b.data('weight') }
    return a.data('objective') - b.data('objective');
    //if (a.data('objective')) return 1;
    //else if (b.hasClass('page')) return 10;
    //else return 20;
  },
  //animate: false, // whether to transition the node positions
  //animationDuration: 500, // duration of animation in ms if enabled
  //animationEasing: undefined, // easing of animation if enabled
  //ready: undefined, // callback on layoutready
  //stop: undefined // callback on layoutstop
}
