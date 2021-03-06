export default {
  name: 'concentric',
  //fit: true, // whether to fit the viewport to the graph
  //padding: 30, // the padding on fit
  //startAngle: 3 / 2 * Math.PI, // where nodes start in radians
  //sweep: undefined, // how many radians should be between the first and last node (defaults to full circle)
  //clockwise: true, // whether the layout should go clockwise (true) or counterclockwise/anticlockwise (false)
  //equidistant: false, // whether levels have an equal radial distance betwen them, may cause bounding box overflow
  //minNodeSpacing: 10, // min spacing between outside of nodes (used for radius adjustment)
  //boundingBox: undefined, // constrain layout bounds; { x1, y1, x2, y2 } or { x1, y1, w, h }
  //avoidOverlap: true, // prevents node overlap, may overflow boundingBox if not enough space
  //nodeDimensionsIncludeLabels: false, // Excludes the label when calculating node bounding boxes for the layout algorithm
  //height: undefined, // height of layout area (overrides container height)
  //width: undefined, // width of layout area (overrides container width)
  //spacingFactor: undefined, // Applies a multiplicative factor (>0) to expand or compress the overall area that the nodes take up
  concentric: node => {
    // returns numeric value for each node, placing higher nodes in
    // levels towards the centre
    if (node.hasClass('visit')) return Number.MIN_SAFE_INTEGER;
    //else if (node.hasClass('objective')) return Number.MAX_SAFE_INTEGER;
    return Number.parseInt(node.data('nb_hits'));
  },
  levelWidth: nodes => { // the variation of concentric values in each level
    //return nodes.maxDegree();
    return 40;
  },
  //animate: false, // whether to transition the node positions
  //animationDuration: 500, // duration of animation in ms if enabled
  //animationEasing: undefined, // easing of animation if enabled
  //ready: undefined, // callback on layoutready
  //stop: undefined // callback on layoutstop
}
