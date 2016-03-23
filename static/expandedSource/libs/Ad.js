'use strict';
// ad constructor
var Ad = function() {
  this.cta = document.getElementById('cta');
  this.catchAll = document.getElementById('catchAll');
  // callback from loader
  this.cb = null;
};
// initialize ad
Ad.prototype.init = function(callback) {
  window.adKit.drawBorder();
  console.log("hello world");
  this.cb = callback;
  // If you have other loading to do, do it first before firing the callback. Move the function to your complete handler of your loading.
  this.fireCallback();
  this.cta.addEventListener("click", this.ctaHandler.bind(this));
  this.catchAll.addEventListener("click", this.catchAllHandler.bind(this));
  if (window != window.top) {
    // in iframe
  } else {
    // on its own, just go
    this.start();
  }
};
Ad.prototype.fireCallback = function() {
  if (this.cb) {
    console.log("firecallback");
    this.cb.call();
    this.cb = null;
  }
};
// DO ALL YOUR ANIMATION STARTING HERE
Ad.prototype.start = function() {
  window.adKit.expandComplete();
  console.log("start");
};
// used to start animated Collapse
// call collapseComplete when done
Ad.prototype.collapse = function() {
  window.adKit.collapseComplete();
};
// called in things like YT masthead to jump animation to end
Ad.prototype.stop = function() {
};
// used to destroy things like greensock timelines
Ad.prototype.destroy = function() {
};
Ad.prototype.catchAllHandler = function(e) {
  window.adKit.catchAllClick();
};
Ad.prototype.ctaHandler = function(e) {
  window.adKit.ctaClick();
};