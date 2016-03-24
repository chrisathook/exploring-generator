'use strict';
var config = require('../config');
var Signal = require("signals");
/**
 * Loader for loading createJS content into Iframes for ads. handles primary and secondary loads and dispatches one event so you know when your content is ready
 * @param targetDIV - the iframe will be created in this div
 * @param url - URL of the html page to load
 * @param id - ID to assign to the iframe
 * @param cssClass - CSS class to assign to the iframe
 * @constructor
 */
var IFrameLoader = function(targetDIV, url, id, cssClass) {
  this.targetDIV = targetDIV;
  this.url = url;
  this.id = id;
  this.cssClass = cssClass;
  this.FTLoadID = null;
  this.contentLoaded = false;
  this.iframe = null; // reference to the iframe node
  this.iframeWindow = null; // reference to the window in the iframe
  this.iframeDocument = null; // reference to the document inside the iframe
  this.ad = null; // refernce to the adkit instance of our custom ad kits. In a generic implementation this will be full.
  this.loaded = new Signal(); // signla for when loading is dine
  this.loaded.memorize = true;
  this._secondaryLoadCallback = this._secondLoadDone.bind(this); // callback for secondary loading
  this._firstLoadHandlerFT_DEL = this._firstLoadHandlerFT.bind(this);
};
// api
/**
 * starts the loading
 */
IFrameLoader.prototype.load = function() {
  this.iframe = document.createElement('iframe');
  this.iframe.setAttribute('id', this.id);
  this.iframe.setAttribute('class', this.cssClass);
  this.iframe.setAttribute('scrolling', 'no');
  this.targetDIV.appendChild(this.iframe);
  this.iframe.onload = this._firstLoadHandler.bind(this);
  this.iframe.setAttribute('src', this.url);
};
IFrameLoader.prototype.loadFlashTalking = function(richID, width, height) {
  this.FTLoadID = richID;
  myFT.richLoads.expand_USER_RL.used = false;
  myFT.on('richload', this._firstLoadHandlerFT_DEL);
  myFT.insertRichLoad({
    richload: this.FTLoadID,
    parent: this.targetDIV,
    width: width,
    height: height
  })
};
/**
 * function to clean up and remove the iframe when its not needed
 */
IFrameLoader.prototype.destroy = function() {
  this.loaded.dispose();
  while (this.targetDIV.firstChild) {
    this.targetDIV.removeChild(this.targetDIV.firstChild);
  }
  this.targetDIV = null;
  this.iframe.onload = null;
  this.iframe = null;
  this.iframeWindow = null;
  this.iframeDocument = null;
  this.ad = null;
};
// EVENT HANDLERS
/**
 * handles when ifame has loaded enough to execute its code and secondary loads
 * @param event
 * @private
 */
IFrameLoader.prototype._firstLoadHandler = function(event) {
  console.log("first load done");
  this.iframe.onload = null;
  this.iframeWindow = this.iframe.contentWindow;
  this.iframeDocument = this.iframe.contentDocument || this.iframe.contentWindow.document;
  // this is custom to our ad kits
  this.ad = this.iframeWindow.animationReference;
  this.ad.init(this._secondaryLoadCallback);
};
IFrameLoader.prototype._firstLoadHandlerFT = function(event) {
  console.log("iframe loaded via FT");
  // some weird bug with unbinding listeners from myFT.
  if (this.contentLoaded === true) {
    return;
  }
  this.iframe = myFT.richloads[this.FTLoadID].frame
  this.iframeWindow =  myFT.richloads[this.FTLoadID].frame.contentWindow;
  this.iframeDocument = this.iframeWindow.document;
  this.ad = this.iframeWindow.animationReference;
  this.contentLoaded = true;
  this.ad.init(this._secondaryLoadCallback);
};
/**
 * callback for when all secondary loading is done
 * @param obj
 * @private
 */
IFrameLoader.prototype._secondLoadDone = function(obj) {
  console.log("second load done");
  this.loaded.dispatch(this);
};
module.exports = IFrameLoader;