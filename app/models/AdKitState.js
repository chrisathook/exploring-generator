'use strict';
var Signal = require("signals");
var config = require('../config');
var AdKitState = function() {
  console.log("DC AdKitState created");
  this.isExpanded = false;
  this.adKitReady = new Signal();
  this.adKitReady.memorize = true;
  this.expansionStart = new Signal();
  this.expansionComplete = new Signal();
  this.collapseStart = new Signal();
  this.collapseComplete = new Signal();
  this._loadAdKit();
};
//*************************************************************************
//Private
//*************************************************************************
AdKitState.prototype._loadAdKit = function() {
  if (!Enabler.isInitialized()) {
    Enabler.addEventListener(studio.events.StudioEvent.INIT, this._enablerInit.bind(this));
  } else {
    this._enablerInit();
  }
};
AdKitState.prototype._enablerInit = function() {
  Enabler.setExpandingPixelOffsets(0, 0, 970, 250); // This needs to be hardcoded to work in DC, it can't run off config
  Enabler.setIsMultiDirectional(false);
  if (config.isAuto === true) {
    Enabler.setStartExpanded(true);
  }
  Enabler.addEventListener(studio.events.StudioEvent.EXPAND_START, this._expandStartHandler.bind(this));
  Enabler.addEventListener(studio.events.StudioEvent.EXPAND_FINISH, this._expandFinishHandler.bind(this));
  Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_START, this._collapseStartHandler.bind(this));
  Enabler.addEventListener(studio.events.StudioEvent.COLLAPSE_FINISH, this._collapseFinishHandler.bind(this));
  if (!Enabler.isPageLoaded()) {
    Enabler.addEventListener(studio.events.StudioEvent.PAGE_LOADED, this._pageLoaded.bind(this));
  } else {
    this._pageLoaded();
  }
};
AdKitState.prototype._pageLoaded = function() {
  if (!Enabler.isVisible()) {
    Enabler.addEventListener(studio.events.StudioEvent.VISIBLE, this._isVisible.bind(this));
  } else {
    this._isVisible();
  }
};
AdKitState.prototype._isVisible = function() {
  this.adKitReady.dispatch();
};
AdKitState.prototype._expandStartHandler = function() {
  this.isExpanded = true;
  this.expansionStart.dispatch();
};
AdKitState.prototype._expandFinishHandler = function() {
  this.expansionComplete.dispatch();
};
AdKitState.prototype._collapseStartHandler = function() {
  this.collapseStart.dispatch();
};
AdKitState.prototype._collapseFinishHandler = function() {
  this.isExpanded = false;
  this.collapseComplete.dispatch();
};
//*************************************************************************
//API
//*************************************************************************
AdKitState.prototype.requestExpand = function() {
  if (this.isExpanded === true) {
    return;
  }
  Enabler.requestExpand();
};
AdKitState.prototype.finishExpand = function() {
  Enabler.finishExpand();
};
AdKitState.prototype.requestCollapse = function(user) {
  if (this.isExpanded !== true) {
    return;
  }
  if (user === true) {
    Enabler.reportManualClose();
  }
  Enabler.requestCollapse();
};
AdKitState.prototype.finishCollapse = function() {
  Enabler.finishCollapse();
};
//*************************************************************************
//Singleton
//*************************************************************************
AdKitState._instance = null;
AdKitState.getInstance = function() {
  if (AdKitState._instance == null) {
    AdKitState._instance = new AdKitState();
  }
  return AdKitState._instance;
};
module.exports = AdKitState;