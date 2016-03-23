'use strict';
var Signal = require("signals");
var TrackingController = function() {
  console.log("DC TrackingController created");
  this.exitTriggered = new Signal();
  Enabler.addEventListener(studio.events.StudioEvent.EXIT, this._exitHandler.bind(this))
};
//*************************************************************************
//Private
//*************************************************************************
TrackingController.prototype._exitHandler = function() {
  this.exitTriggered.dispatch();
};
//*************************************************************************
//API
//*************************************************************************
TrackingController.prototype.standardCatchAll = function() {
  Enabler.exit("catch_all");
};
TrackingController.prototype.standardCTA = function() {
  Enabler.exit("cta");
};
TrackingController.prototype.customExit = function(eventClosure) {
  eventClosure.call(window);
};
TrackingController.prototype.customTracking = function(eventClosure) {
  eventClosure.call(window);
};
//*************************************************************************
//Singleton
//*************************************************************************
TrackingController._instance = null;
TrackingController.getInstance = function() {
  if (TrackingController._instance == null) {
    TrackingController._instance = new TrackingController();
  }
  return TrackingController._instance;
};
module.exports = TrackingController;