export default {
  name: 'concentric',
  ready: (CY) => {
    //if (!CY) return;
    console.log('ready layout');
    //let index = CY.nodes("[label='index']");
    //console.log('INDEX FOUND', index.data());
    //VIEW_UTILS.hide(index);
    //index.remove();
  },
  concentric: (node) => {
    let data = node.data();
    if (node.hasClass('page')) return 10;
    else if (node.hasClass('objective')) return 30;
    else return 1;
  },
  levelWidth: (nodes) => {
    return 5;
  }
}
