'use strict';

var inherits = require('inherits');

var App = require ("./app");

var MyAd = function () {

  App.call (this);

  this.superProto = this.constructor.super_.prototype;

  this.player = null;
  console.log ("My Ad Hello World");


  this.adKitState.adKitReady.addOnce(this.preload, this);


  
};

inherits(MyAd, App);


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
  this.preloadComplete()
};

MyAd.prototype.preloadComplete = function () {
  this.init ();
  this.loadCollapsed();
};



MyAd.prototype._collapsedLoadedAUTO = function(signal) {
  this.superProto._collapsedLoadedAUTO.call (this);
  this.loadAuto();


};


MyAd.prototype._expandStartHandlerUSER = function(signal) {
  this.superProto._expandStartHandlerUSER.call (this);
  this.loadUser()
};


MyAd.prototype._expandFinishHandlerAUTO = function(signal) {
  this.superProto._expandFinishHandlerAUTO.call (this);
  document.getElementById("player").style.opacity = 1;
};

MyAd.prototype._collapseStartHandlerAUTO = function(signal) {
  document.getElementById("player").style.opacity = 0;
  this.player.pauseVideo();
  this.superProto._collapseStartHandlerAUTO.call (this);
};



MyAd.prototype._expandFinishHandlerUSER  = function(signal) {
  this.superProto._expandFinishHandlerUSER .call (this);
  document.getElementById("player").style.opacity = 1;

};

MyAd.prototype._collapseStartHandlerUSER  = function(signal) {
  this.player.pauseVideo();
  document.getElementById("player").style.opacity = 0;
  this.superProto._collapseStartHandlerUSER .call (this);
};




module.exports = MyAd;