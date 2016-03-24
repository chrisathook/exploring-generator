'use strict';

var config = require('./config');
var App = require ("./app");

var MyAd = function () {

  this.app = new App ();

  //cheat so I don't have to refactor the animation templates yet since this is a proof of concept
  this.adKitState = this.app.adKitState;
  this.trackingController = this.app.trackingController;

  this.player = null;
  console.log ("My Ad Hello World");


  this.adKitState.adKitReady.addOnce(this.preload, this);





  
};



MyAd.prototype.preload = function () {
  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];
  window.onYouTubeIframeAPIReady  =this.apiReady.bind (this);
  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

};


MyAd.prototype.apiReady = function () {
  this.player = new YT.Player('player', {
    height: '390',
    width: '500',
    videoId: 'M7lc1UVf-VE',
    events: {
      'onReady': this.playerReady.bind (this)
    }
  });

};

MyAd.prototype.playerReady = function () {

    this.app.init ();



    if (config.isAuto) {
      this.app.collapsedLoader.loaded.addOnce(this._collapsedLoadedAUTO, this,11);
    }else {

      this.app.collapsedLoader.loaded.addOnce(this._collapsedLoadedUSER, this,11);
    }

    this.app.loadCollapsed();

};




MyAd.prototype._collapsedLoadedAUTO = function(signal) {



   this.app.adKitState.expansionComplete.addOnce(this._expandFinishHandlerAUTO, this,11);
   this.app.adKitState.collapseStart.addOnce(this._collapseStartHandlerAUTO, this,9);
   this.app.adKitState.collapseComplete.addOnce(this._collapseFinishHandlerAUTO, this,9);

  this.app.loadAuto();


};


MyAd.prototype._collapsedLoadedUSER = function(signal) {
   this.app.adKitState.expansionStart.add(this._expandStartHandlerUSER, this,11);
   this.app.adKitState.expansionComplete.add(this._expandFinishHandlerUSER, this,11);
   this.app.adKitState.collapseStart.add(this._collapseStartHandlerUSER, this,9);

};





MyAd.prototype._expandFinishHandlerAUTO = function(signal) {

  document.getElementById("player").style.opacity = 1;
};

MyAd.prototype._collapseStartHandlerAUTO = function(signal) {
  document.getElementById("player").style.opacity = 0;
  this.player.pauseVideo();
};

MyAd.prototype._collapseFinishHandlerAUTO = function(signal) {

   this.app.adKitState.expansionStart.add(this._expandStartHandlerUSER, this,11);
   this.app.adKitState.expansionComplete.add(this._expandFinishHandlerUSER, this,11);
   this.app.adKitState.collapseStart.add(this._collapseStartHandlerUSER, this,9);

  document.getElementById("player").style.opacity = 0;
  this.player.pauseVideo();
};


MyAd.prototype._expandStartHandlerUSER = function(signal) {




  this.app.loadUser()
};


MyAd.prototype._expandFinishHandlerUSER  = function(signal) {
  document.getElementById("player").style.opacity = 1;

};

MyAd.prototype._collapseStartHandlerUSER  = function(signal) {
  this.player.pauseVideo();
  document.getElementById("player").style.opacity = 0;
};




module.exports = MyAd;