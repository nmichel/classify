(function() {
  var defaultCtor = function() {
    this.super();
  };

  function buildClass(desc) {
    var B = desc.extend || Object;

    var buildSuper = function(name) {
      var fn = undefined;
      var p = B.prototype;
      while (!fn && p) {
        fn = p[name];
        p = p.prototype;
      }

      if (fn === undefined || typeof fn !== 'function') {
        return function() {
          throw new Error('no method "' + name + '" found'); // <== 
        };
      }

      return fn;
    };

    var buildWrapper = function(what, name) {
      var super_ = buildSuper(name);
      return function() {
        var params = [].splice.call(arguments, 0);
        var oldsuper = this.super;
        this.super = super_;
        var r = what.apply(this, params);
        this.super = oldsuper;
        return r;
      }
    };

    var ctor = desc.ctor || defaultCtor;
    var lockState = (desc.lockAfterCtor === true);
    var super_ = function() {
      var params = [].splice.call(arguments, 0);
      return B.apply(this, params);
    };

    var clazz = function() {
      var params = [].splice.call(arguments, 0);
      var oldsuper = this.super;
      this.super = super_;
      ctor.apply(this, params);
      this.super = oldsuper;
      if (lockState) {
        Object.seal(this);
      }
    };
    clazz.prototype = new B;
    clazz.prototype.constructor = clazz;

    var methods = desc.methods || {};
    var props = {};
    for (var m in methods) {
      props[m] = {
        enumerable: true,
        value: buildWrapper(methods[m], m)
      };
    }
    Object.defineProperties(clazz.prototype, props);

    var functions = desc.functions || {};
    var statics = {};
    for (var m in functions) {
      statics[m] = {
        enumerable: true,
        value: functions[m].bind(clazz)
      };
    }
    Object.defineProperties(clazz, statics);

    return clazz;
  }

  if (typeof window !== 'undefined') {
    window.buildClass = buildClass;
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = buildClass;
  }
})();

