'use strict';
var PathUpdater = function(path) {
  /*
    config.collapseAnimationSource = './collapsedSource/index-collapsedSource.html';
    config.autoAnimationSource = './expandedSource/index-expandedSource.html';
    config.userAnimationSource = './expandedSource/index-expandedSource.html';*/
  var firstSplitItem = path.split("/")[1];
  path = path.replace(/index/, "index-" + firstSplitItem);
  return path;
};
module.exports = PathUpdater;