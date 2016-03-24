'use strict';
var config = require('./config');
var IFrameLoader = require('./loaders/iframe_loader');
var BorderManager = require('./views/BorderManager');
var AdKitState = require("./models/AdKitState");
var TrackingController = require("./tracking/TrackingController");
var PathUpdater = require('./utils/UpdateRichLoadPath');
var App = function() {
  console.log('hello world');
  this.adKitState = AdKitState.getInstance();
  this.trackingController = null;
  this._borderManager = new BorderManager();
  // event handlers with correct bindings
  this._timerHandler = this._timerHandler.bind(this);
  this._closeButtonHandler = this._closeButtonHandler.bind(this);
  // END BINDINGS
  // div references
  // divs hold loaded iframe content
  this.collapsedDIV = document.getElementById("collapsedContainer");
  this.autoDIV = document.getElementById("autoExpandContainer");
  this.userDIV = document.getElementById("userExpandedContainer");
  this.closeButton = document.getElementById("closeButton");
  // loaders
  this.collapsedLoader = null;
  this.autoLoader = null;
  this.userLoader = null;
  // reference for auto timer, set by window.setTimeout if needed
  this._autoTimer = 0;

  this.closeButton.addEventListener("click", this._closeButtonHandler);

};
// api



/**
 * called once all initialization events are complete.
 */
App.prototype.init = function() {

  console.log("page loaded");
  this.trackingController = TrackingController.getInstance();
  this.trackingController.exitTriggered.add(this._exitHandler, this,10);
  config.collapseAnimationSource = PathUpdater(config.collapseAnimationSource);
  config.autoAnimationSource = PathUpdater(config.autoAnimationSource);
  config.userAnimationSource = PathUpdater(config.userAnimationSource);
  this.collapsedLoader = new IFrameLoader(this.collapsedDIV, config.collapseAnimationSource, "collapsedIframeSource", "collapsed");
  this.autoLoader = new IFrameLoader(this.autoDIV, config.autoAnimationSource, "autoIframeSource", "expanded");

};

App.prototype.loadCollapsed = function() {

  if (config.isAuto) {
      this.collapsedLoader.loaded.addOnce(this._collapsedLoadedAUTO, this,10);
  } else {
      this.collapsedLoader.loaded.addOnce(this._collapsedLoadedUSER, this,10);
  }

  this.collapsedLoader.load();

  return this.userLoader;
};

App.prototype.loadAuto = function() {

  this.autoLoader.loaded.addOnce(this._autoLoaded, this,10 );
  this.autoLoader.load();

  return this.autoLoader;

};

App.prototype.loadUser = function() {

  this.userLoader = new IFrameLoader(this.userDIV, config.userAnimationSource, "userIframeSource", "expanded");
  this.userLoader.loaded.addOnce(this._userLoaded, this,10);
  this.userLoader.load();

  return this.userLoader;
};

// ***************************************************************************************************************************************************************
// PRIVATE FUNCTIONS
// ***************************************************************************************************************************************************************
App.prototype._addAutoListeners = function() {
  this.adKitState.expansionStart.add(this._expandStartHandlerAUTO, this,10);
  this.adKitState.expansionComplete.add(this._expandFinishHandlerAUTO, this,10);
  this.adKitState.collapseStart.add(this._collapseStartHandlerAUTO, this,10);
  this.adKitState.collapseComplete.add(this._collapseFinishHandlerAUTO, this,10);
};
App.prototype._removeAutoListeners = function() {
  this.adKitState.expansionStart.remove(this._expandStartHandlerAUTO, this);
  this.adKitState.expansionComplete.remove(this._expandFinishHandlerAUTO, this);
  this.adKitState.collapseStart.remove(this._collapseStartHandlerAUTO, this);
  this.adKitState.collapseComplete.remove(this._collapseFinishHandlerAUTO, this);
};
App.prototype._addUserListeners = function() {
  this.adKitState.expansionStart.add(this._expandStartHandlerUSER, this,10);
  this.adKitState.expansionComplete.add(this._expandFinishHandlerUSER, this,10);
  this.adKitState.collapseStart.add(this._collapseStartHandlerUSER, this,10);
  this.adKitState.collapseComplete.add(this._collapseFinishHandlerUSER, this,10);
};
App.prototype._removeUserListeners = function() {
  this.adKitState.expansionStart.remove(this._expandStartHandlerUSER, this);
  this.adKitState.expansionComplete.remove(this._expandFinishHandlerUSER, this);
  this.adKitState.collapseStart.remove(this._collapseStartHandlerUSER, this);
  this.adKitState.collapseComplete.remove(this._collapseFinishHandlerUSER, this);
};
App.prototype._startTimer = function() {
  if (config.autoTime === 0) {
    console.log("Timer Set to 0 ");
    return;
  }
  console.log("Start Timer");
  this._autoTimer = window.setTimeout(this._timerHandler, config.autoTime);
};
App.prototype._stopTimer = function() {
  console.log("Stop Timer");
  window.clearTimeout(this._autoTimer);
};
// ***************************************************************************************************************************************************************
// EVENT HANDLERS RELATED TO LOADING
// ***************************************************************************************************************************************************************


App.prototype._collapsedLoadedAUTO = function(signal) {
    this._addAutoListeners();
};

App.prototype._collapsedLoadedUSER = function(signal) {
    this._addUserListeners();
    this._borderManager.moveBottomBorderUp();
    this.collapsedDIV.setAttribute('class', "opaque collapsed");
    this.collapsedLoader.ad.start();

};

App.prototype._autoLoaded = function(signal) {
  console.log(" shell auto is loaded");
  this.adKitState.requestExpand();
};
App.prototype._userLoaded = function(signal) {
  console.log(" shell user is loaded");
  this.userLoader.ad.start();
};
// ***************************************************************************************************************************************************************
// EVENT HANDLERS RELATED TO AUTO EXPANSION
// ***************************************************************************************************************************************************************
App.prototype._expandStartHandlerAUTO = function(signal) {
  console.log("APP _expandStartHandlerAUTO");
  this._startTimer();
  this.autoDIV.setAttribute('class', "opaque expanded");
  this.autoLoader.ad.start();
};
App.prototype._expandFinishHandlerAUTO = function(signal) {
  console.log("APP _expandFinishHandlerAUTO");
  this.closeButton.setAttribute('class', 'opaque');
  this._borderManager.moveBottomBorderDown();
};
App.prototype._collapseStartHandlerAUTO = function(signal) {
  console.log("APP _collapseStartHandlerAUTO");
  this._stopTimer();
  this.closeButton.setAttribute('class', 'non-opaque');
  this.autoLoader.ad.collapse();
};
App.prototype._collapseFinishHandlerAUTO = function(signal) {
  this._borderManager.moveBottomBorderUp();
  console.log("APP _collapseFinishHandlerAUTO");
  this.autoLoader.destroy();
  this.autoDIV.parentNode.removeChild(this.autoDIV);
  this.collapsedDIV.setAttribute('class', "opaque collapsed");
  this.collapsedLoader.ad.start();
  config.isAuto = false;
  this._removeAutoListeners();
  this._addUserListeners();
};
// ***************************************************************************************************************************************************************
// EVENT HANDLERS RELATED TO USER  EXPANSION
// ***************************************************************************************************************************************************************
App.prototype._expandStartHandlerUSER = function(signal) {
  this.userDIV.setAttribute('class', "opaque expanded");
  this._borderManager.moveBottomBorderDown();
  //this.loadUser()
};
App.prototype._expandFinishHandlerUSER = function(signal) {
  console.log("_expandFinishHandlerUSER");
  this.closeButton.setAttribute('class', 'opaque');
};
App.prototype._collapseStartHandlerUSER = function(signal) {
  console.log("_collapseStartHandlerUSER");
  this.closeButton.setAttribute('class', 'non-opaque');
  this.userLoader.ad.collapse();
};
App.prototype._collapseFinishHandlerUSER = function(signal) {
  console.log("_collapseFinishHandlerUSER");
  this._borderManager.moveBottomBorderUp();
  this.userLoader.destroy();
  this.userLoader = null;
  this.userDIV.setAttribute('class', "non-opaque collapsed");
};
// ***************************************************************************************************************************************************************
// OTHER EVENT HANDLERS
// ***************************************************************************************************************************************************************
App.prototype._exitHandler = function(event) {
  this.adKitState.requestCollapse();
};
App.prototype._closeButtonHandler = function(event) {
  this.adKitState.requestCollapse(true);
};
App.prototype._timerHandler = function() {
  this.adKitState.requestCollapse();
};
module.exports = App;