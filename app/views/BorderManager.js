'use strict';
var config = require('../config');
var BorderManager = function() {
};
BorderManager.prototype.moveBottomBorderDown = function() {
  document.getElementById('border-bottom').style.top = (config.expandedHeight - 1) + 'px';
  document.getElementById('border-left').style.height = (config.expandedHeight - 1) + 'px';
  document.getElementById('border-right').style.height = (config.expandedHeight - 1) + 'px';
  if (config.shellBorder) {
    document.getElementsByTagName('body')[0].className = 'show-border';
  }
};
BorderManager.prototype.moveBottomBorderUp = function() {
  document.getElementById('border-bottom').style.top = (config.baseHeight - 1) + 'px';
  document.getElementById('border-left').style.height = (config.baseHeight - 1) + 'px';
  document.getElementById('border-right').style.height = (config.baseHeight - 1) + 'px';
  if (config.shellBorder) {
    document.getElementsByTagName('body')[0].className = 'show-border';
  }
};
module.exports = BorderManager;