/**
 * Created by Christopher on 11/11/2015.
 */
(function(window) {
  /**
   * Base module for ad kit. Stores internal functions and defines an API of functions that get populated by passed in ad kit implementation.
   * @constructor
   */
  var AdKit = function(adImp) {
    console.log("ad kit base initialized");
    this.adImp = adImp;
    if (typeof this.adImp === "undefined") {
      console.warn("You must provide an Ad Implementation to use this kit");
    }
    this.modes = {
      createjs: "createjs",
      greensock: "greensock",
      css: "css"
    };
    this.mode = null;
    this.android = false;
    this.ios = false;
    this.desktop_chrome = false;
    this.desktop_other = false;
    this.isDevice = false;
    this.useragent = navigator.userAgent;
    this.useragent = this.useragent.toLowerCase();
    // function bindings for parts of the API that tare public
    this.catchAllClick = this._catchAllClick.bind(this);
    this.ctaClick = this._ctaClick.bind(this);
    this.replay = this._replay.bind(this);
    this.manualClose = this._manualClose.bind(this);
    this.requestExpand = this._requestExpand.bind(this);
    this.expandStart = this._expandStart.bind(this);
    this.expandComplete = this._expandComplete.bind(this);
    this.requestCollapse = this._requestCollapse.bind(this);
    this.collapseStart = this._collapseStart.bind(this);
    this.collapseComplete = this._collapseComplete.bind(this);
    this.createButton = this._createButton.bind(this);
    this.drawBorder = this._drawBorder.bind(this);
    this._detectPlatform();
  };
  /*************************************************************************************
   Common Public API functions
   User must provide implementation to work
   **************************************************************************************/
  /**
   * wrapper for catch all click handlers
   * @param e
   */
  AdKit.prototype._catchAllClick = function(e) {
    if (this._allowClick(e)) {
      this.adImp.catchAllClick_imp.call(this, e);
    }
  };
  AdKit.prototype._ctaClick = function(e) {
    if (this._allowClick(e)) {
      this.adImp.ctaClick_imp.call(this, e);
    }
  };
  AdKit.prototype._replay = function(e) {
    if (this._allowClick(e)) {
      this.adImp.replay_imp.call(this, e);
    }
  };
  AdKit.prototype._manualClose = function() {
    this.adImp.manualClose_imp.call(this);
  };
  AdKit.prototype._requestExpand = function() {
    this.adImp.requestExpand_imp.call(this);
  };
  AdKit.prototype._expandStart = function() {
    this.adImp.expandStart_imp.call(this);
  };
  AdKit.prototype._expandComplete = function() {
    this.adImp.expandComplete_imp.call(this);
  };
  AdKit.prototype._requestCollapse = function() {
    this.adImp.requestCollapse_imp.call(this);
  };
  AdKit.prototype._collapseStart = function() {
    this.adImp.collapseStart_imp.call(this);
  };
  AdKit.prototype._collapseComplete = function() {
    this.adImp.collapseComplete_imp.call(this);
  };
  AdKit.prototype.boot = function(bootObject) {
    this.adImp.boot_imp.call(this, bootObject);
  };
  /*************************************************************************************
   CreateJS functions
   **************************************************************************************/
  /**
   * Helper method to fix button issues in Easel.js
   * also kills button function on mobile when called
   * @type {function(this:AdKit)}
   */
  AdKit.prototype._createButton = function(clip, clickHandler) {
    if (this.ios === true || this.android === true) {
      clip.removeAllEventListeners("mouseover");
      clip.removeAllEventListeners("mouseout");
      stage.enableMouseOver(0);
      console.log("killing Rollovers on mobile");
    }
    clip.cursor = "pointer";
    clip.mouseChildren = false;
    if (clip.hit) {
      c = clip;
      var hit = clip.hit;
      var hitShape = hit.children[0];
      var h = {};
      h.x = hit.x - hit.regX * hit.scaleX;
      h.y = hit.y - hit.regY * hit.scaleY;
      h.instructions = hitShape.graphics._activeInstructions;
      h.cornerA = h.instructions[1];
      h.cornerB = h.instructions[3];
      h.width = Math.abs(h.cornerA.x - h.cornerB.x) * hit.scaleX;
      h.height = Math.abs(h.cornerA.y - h.cornerB.y) * hit.scaleY;
      var hitArea = new createjs.Shape();
      hitArea.graphics.beginFill("#000").drawRect(h.x, h.y, h.width, h.height);
      clip.hitArea = hitArea;
    }
  };
  AdKit.prototype._allowClick = function(e) {
    var isRightMB = false;
    try {
      if ("which" in e.nativeEvent) { // Gecko (Firefox), WebKit (Safari/Chrome) & Opera
        isRightMB = e.nativeEvent.which == 3;
      } else if ("button" in e.nativeEvent) { // IE, Opera
        isRightMB = e.nativeEvent.button == 2;
      }
      if (isRightMB === true) {
        console.log("AdKit: RMB Suppress");
        return false;
      } else {
        return true;
      }
    } catch (error) {
      return true;
    }
    return true;
  };
  /*************************************************************************************
   internal API
   **************************************************************************************/
  AdKit.prototype._detectPlatform = function() {
    if (this.useragent.indexOf('iphone') != -1 || this.useragent.indexOf('ipad') != -1 || this.useragent.indexOf('ipod') != -1) {
      this.ios = true;
      this.isDevice = true;
    } else if (this.useragent.indexOf('android') != -1) {
      this.android = true;
      this.isDevice = true;
    } else if (this.useragent.indexOf('Chrome') != -1 || this.useragent.indexOf('chrome') != -1) {
      this.desktop_chrome = true;
    } else {
      this.desktop_other = true;
    }
    if (typeof window.createjs !== 'undefined') {
      this.mode = this.modes.createjs;
    } else if (typeof window.TweenLite !== 'undefined') {
      this.mode = this.modes.greensock;
    } else {
      this.mode = this.modes.css;
    }
    console.log("AdKit: detectMode:", this.mode);
  };
  AdKit.prototype._drawBorder = function() {
    console.log("Draw Border");
    var metas = document.getElementsByTagName('meta');
    var borderProps = null;
    for (i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute("name") == "border.dimensions") {
        borderProps = metas[i].getAttribute("content");
      }
    }
    var borderObject = null;
    if (borderProps) {
      borderProps = borderProps.replace(/\s+/g, '');
      var splitOne = borderProps.split(",");
      borderObject = {};
      for (var j = 0; j < splitOne.length; j++) {
        var splitTwo = splitOne[j].split("=");
        borderObject[splitTwo[0]] = splitTwo[1];
      }
    } else {
      return;
    }
    if (borderObject.drawBorder == "true") {
      var leftBorder = document.createElement("div");
      leftBorder.style.width = "1px";
      leftBorder.style.height = borderObject.height + "px";
      leftBorder.style.background = "#" + borderObject.color;
      leftBorder.style.position = "absolute";
      leftBorder.style.top = "0px";
      leftBorder.style.left = "0px";
      leftBorder.style.pointerEvents = "none";
      document.body.appendChild(leftBorder);
      var rightBorder = document.createElement("div");
      rightBorder.style.width = "1px";
      rightBorder.style.height = borderObject.height + "px";
      rightBorder.style.background = "#" + borderObject.color;
      rightBorder.style.position = "absolute";
      rightBorder.style.top = "0px";
      rightBorder.style.left = (borderObject.width - 1) + "px";
      rightBorder.style.pointerEvents = "none";
      document.body.appendChild(rightBorder);
      var bottomBorder = document.createElement("div");
      bottomBorder.style.width = borderObject.width + "px";
      bottomBorder.style.height = "1px";
      bottomBorder.style.background = "#" + borderObject.color;
      bottomBorder.style.position = "absolute";
      bottomBorder.style.top = (borderObject.height - 1) + "px";
      bottomBorder.style.left = "0px";
      bottomBorder.style.pointerEvents = "none";
      document.body.appendChild(bottomBorder);
      var topBorder = document.createElement("div");
      topBorder.style.width = borderObject.width + "px";
      topBorder.style.height = "1px";
      topBorder.style.background = "#" + borderObject.color;
      topBorder.style.position = "absolute";
      topBorder.style.top = "0px";
      topBorder.style.left = "0px";
      topBorder.style.pointerEvents = "none";
      document.body.appendChild(topBorder);
    }
  };
  window.AdKit = AdKit;
})(window);