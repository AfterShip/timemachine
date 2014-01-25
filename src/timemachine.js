(function(name, definition) {
  if (typeof define === 'function') { // AMD
    define(definition);
  } else if (typeof module !== 'undefined' && module.exports) { // Node.js
    module.exports = definition();
  } else { // Browser
    var timemachine = definition(),
      global = this,
      old = global[name];
    timemachine.noConflict = function() {
      global[name] = old;
      return timemachine;
    };
    global[name] = timemachine;
  }
})('timemachine', function() {

  var OriginalDate = Date,
    Timemachine = {

      timestamp: 0,
      tick: false,
      tickStartDate: null,
      difference: 0,

      config: function(options) {
        this.timestamp = OriginalDate.parse(options.dateString) || options.timestamp || this.timestamp;
        this.difference = options.difference || this.difference;
        this.tick = options.tick || this.tick;
        if (this.tick) {
          this.tickStartDate = new OriginalDate();
        }
        this._apply();
      },

      reset: function() {
        this.timestamp = 0;
        this.tick = false;
        this.tickStartDate = null;
        this.difference = 0;
        Date = OriginalDate;
        Date.prototype = OriginalDate.prototype;
      },

      _apply: function() {
        var self = this;

        Date = function() {
          var date,
            difference = self.difference;

          if (arguments.length === 1) {
            date = new OriginalDate(arguments[0]);
          } else if (arguments.length === 7) {
            date = new OriginalDate(arguments[0], arguments[1], arguments[2], arguments[3], arguments[4], arguments[5], arguments[6]);
          } else {
            date = new OriginalDate(self.timestamp);
          }

          // tick tack
          if (self.tick) {
            difference += OriginalDate.now() - self.tickStartDate.getTime();
          }

          // add difference
          if (difference !== 0) {
            date = new OriginalDate(date.getTime() + difference);
          }

          return date;
        };

        Date.prototype = OriginalDate.prototype;
        Date.now = function() {
          return self.timestamp + self.difference;
        };
        Date.OriginalDate = OriginalDate;

      },

    };

  Timemachine._apply();

  return Timemachine;

});