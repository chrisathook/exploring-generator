'use strict';

var inherits = require('inherits');

var App = require ("./app");

var MinAd = function () {

  App.call (this);

  this.superProto = this.constructor.super_.prototype;


  console.log ("My Ad Hello World");


  this.adKitState.adKitReady.addOnce(this.preload, this);


  
};

inherits(MinAd, App);


MinAd.prototype.preload = function () {

  this.preloadComplete()

};



MinAd.prototype.preloadComplete = function () {
  this.init ();
  this.loadCollapsed();
};



MinAd.prototype._collapsedLoadedAUTO = function(signal) {
  this.superProto._collapsedLoadedAUTO.call (this);
  this.loadAuto();


};


MinAd.prototype._expandStartHandlerUSER = function(signal) {
  this.superProto._expandStartHandlerUSER.call (this);
  this.loadUser()
};







module.exports = MinAd;