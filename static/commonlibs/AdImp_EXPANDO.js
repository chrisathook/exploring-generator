/**
 * Created by Christopher on 11/11/2015.
 */
(function(window) {
  /**
   * Base module for ad kit. Stores internal functions and defines an API of functions that get populated by passed in ad kit implementation.
   * all the functions get called in the scope of the AdKitBase not here.
   * @constructor
   */
  var AdImp = function() {
    console.info("Ad Kit for Animation IN Expanding Units without regard to ad kit ");
    this._validate();
  };
  /**************************************************************************************
   * API Common to all ad kits
   **************************************************************************************/
  AdImp.prototype.catchAllClick_imp = function(e) {
    console.log("AdKit: catch all");
    window.parent.app.trackingController.standardCatchAll();
  };
  AdImp.prototype.ctaClick_imp = function(e) {
    console.log("AdKit: cta");
    window.parent.app.trackingController.standardCTA();
  };
  AdImp.prototype.manualClose_imp = function() {
    console.log("AdKit: manualClose");
    window.parent.app.adKitState.requestCollapse(true);
  };
  AdImp.prototype.requestExpand_imp = function() {
    console.log("AdKit: requestExpand");
    window.parent.app.adKitState.requestExpand();
  };
  AdImp.prototype.expandStart_imp = function() {
    console.log("AdKit: Expand Start");
  };
  AdImp.prototype.expandComplete_imp = function() {
    console.log("AdKit: Expand Complete");
    window.parent.app.adKitState.finishExpand();
  };
  AdImp.prototype.requestCollapse_imp = function() {
    window.parent.app.adKitState.requestCollapse();
  };
  AdImp.prototype.collapseStart_imp = function() {
    console.log("AdKit: Collapse Start");
  };
  AdImp.prototype.collapseComplete_imp = function() {
    console.log("AdKit: Collapse Complete");
    window.parent.app.adKitState.finishCollapse();
  };
  AdImp.prototype.replay_imp = function(e) {
    createjs.Ticker.removeEventListener("tick", stage);
    stage.removeChild(exportRoot);
    exportRoot = new lib.index();
    stage.addChild(exportRoot);
    stage.update();
    if (this.ios === true || this.android === true) {
      stage.enableMouseOver(0);
    }
    createjs.Ticker.addEventListener("tick", stage);
  };
  AdImp.prototype.boot_imp = function(bootObject) {
    console.log("Boot Ad");
    if (window != window.parent) {
      // in iframe
      console.log("animation in iframe")
      window.animationReference = bootObject;
    } else {
      // on its own, just go
      bootObject.init();
    }
  };
  /**************************************************************************************
   * Internal API
   **************************************************************************************/
  /**
   * does some basic validation on the template to ensure its set up properly.
   * @private
   */
  AdImp.prototype._validate = function() {
  };
  window.AdImp = AdImp;
})(window);