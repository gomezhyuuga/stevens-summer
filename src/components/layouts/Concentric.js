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
    let number = 10;
    if (node.hasClass('page')) number = 5;
    else if (node.hasClass('objective')) number = 10;
    else number = node.degree();

    return number;
  },
  levelWidth: (nodes) => {
    return 4;
  }
}
