'use strict';

var config = require('./config');
var App = require ("./app");

var MinAd = function () {

  this.app = new App ();

  //cheat so I don't have to refactor the animation templates yet since this is a proof of concept
  this.adKitState = this.app.adKitState;
  this.trackingController = this.app.trackingController;


  console.log ("My Ad Hello World");


  this.adKitState.adKitReady.addOnce(this.preload, this);





  
};



MinAd.prototype.preload = function () {
    this.app.init ();



    if (config.isAuto) {
      this.app.collapsedLoader.loaded.addOnce(this._collapsedLoadedAUTO, this,11);
    }else {

      this.app.collapsedLoader.loaded.addOnce(this._collapsedLoadedUSER, this,11);
    }

    this.app.loadCollapsed();

};








MinAd.prototype._collapsedLoadedAUTO = function(signal) {



  this.app.adKitState.collapseComplete.addOnce(this._collapseFinishHandlerAUTO, this,9);

  this.app.loadAuto();


};


MinAd.prototype._collapsedLoadedUSER = function(signal) {
   this.app.adKitState.expansionStart.add(this._expandStartHandlerUSER, this,11);

};






MinAd.prototype._collapseFinishHandlerAUTO = function(signal) {

   this.app.adKitState.expansionStart.add(this._expandStartHandlerUSER, this,11);


};


MinAd.prototype._expandStartHandlerUSER = function(signal) {

  this.app.loadUser()
};






module.exports = MinAd;