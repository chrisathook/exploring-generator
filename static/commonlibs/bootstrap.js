(function(window) {
  window.onload = function() {
    window.adKit = new AdKit(new AdImp());
    window.ad = new Ad();
    window.adKit.boot(window.ad);
  }.bind(this);
})(window);