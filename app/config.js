'use strict';
var config = {};
config.isAuto = true; // set to true for auto expanding, false for user only.
config.autoTime = 0; // in milliseconds - if this is > 0 the auto timer will run, else banner will remain open
config.baseWidth = 970; // collapsed width
config.baseHeight = 90; // collapsed height
config.expandedWidth = 970; // expanded width
config.expandedHeight = 250; // expanded height
config.shellBorder = true;
config.collapseAnimationSource = './collapsedSource/index.html';
config.autoAnimationSource = './expandedSource/index.html';
config.userAnimationSource = './expandedSource/index.html';
module.exports = config;