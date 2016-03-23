'use strict';

var inherits = require('inherits');

var App = require ("./app");

var MyAd = function () {

  App.call (this);

  this.superProto = this.constructor.super_.prototype;
  console.log ("My Ad Hello World");


  this.adKitState.adKitReady.addOnce(this.preload, this);

  
};

inherits(MyAd, App);


/**
 * do any preloading before the content is loaded;
 */

MyAd.prototype.preload = function () {




  var tag = document.createElement('script');
  tag.src = "https://www.youtube.com/iframe_api";
  var firstScriptTag = document.getElementsByTagName('script')[0];

  window.onYouTubeIframeAPIReady  =this.preloadComplete.bind (this);

  firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

};

/**
 * call when your preloading is done, will load the iframe content
 */
MyAd.prototype.preloadComplete = function () {

  this.init ();

};




/**************************************************************************************************************************
 
 API
 
 ***************************************************************************************************************************/

/**************************************************************************************************************************
 
 Private Functions
 
 ***************************************************************************************************************************/


/**************************************************************************************************************************
 
 Event Handlers
 
 ***************************************************************************************************************************/


MyAd.prototype._expandStartHandlerAUTO = function(signal) {

  //clean up your stuff before
  this.superProto._expandStartHandlerAUTO.call (this);



};
MyAd.prototype._expandFinishHandlerAUTO = function(signal) {


 //clean up your stuff before
 this.superProto._expandFinishHandlerAUTO.call (this);


};
MyAd.prototype._collapseStartHandlerAUTO = function(signal) {

  //clean up your stuff before
  this.superProto._collapseStartHandlerAUTO.call (this);



};
MyAd.prototype._collapseFinishHandlerAUTO = function(signal) {
  //clean up your stuff before
  this.superProto._collapseFinishHandlerAUTO.call (this);


};


MyAd.prototype._expandStartHandlerUSER  = function(signal) {

  //clean up your stuff before
  this.superProto._expandStartHandlerUSER .call (this);



};
MyAd.prototype._expandFinishHandlerUSER  = function(signal) {


 //clean up your stuff before
 this.superProto._expandFinishHandlerUSER .call (this);


};
MyAd.prototype._collapseStartHandlerUSER  = function(signal) {

  //clean up your stuff before
  this.superProto._collapseStartHandlerUSER .call (this);



};
MyAd.prototype._collapseFinishHandlerUSER  = function(signal) {
  //clean up your stuff before
  this.superProto._collapseFinishHandlerUSER.call (this);


};



module.exports = MyAd;