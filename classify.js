(function() {

  var defaultCtor = function() {
    this.super();
  };


  var lookup = function(base, name) {
    var fn = undefined;
    var p = base.prototype;
    while (!fn && p) {
      fn = p[name];
      p = p.prototype;
    }

    return fn;
  };
    
  var buildSuper = function(base, name) {
    var fn = lookup(base, name);

    if (fn === undefined || typeof fn !== 'function') {
      return function() {
        throw new Error('no method "' + name + '" found'); // <== 
      };
    }

    return fn;
  };

  var buildWrapper = function(base, what, name) {
    var super_ = buildSuper(base, name);
    return function() {
      var params = [].splice.call(arguments, 0);
      var oldsuper = this.super;
      this.super = super_;
      var r = what.apply(this, params);
      this.super = oldsuper;
      return r;
    }
  };

  function buildClass(desc) {
    var B = desc.extend || Object;

    var ctor = desc.ctor || defaultCtor;
    var clazz = function() {
      var params = [].splice.call(arguments, 0);
      var oldsuper = this.super;
      this.super = B;
      ctor.apply(this, params);
      this.super = oldsuper;
    };
    clazz.prototype = new B;
    clazz.prototype.constructor = clazz;

    var methods = desc.methods || {};
    var props = {};
    for (var m in methods) {
      props[m] = {
        enumerable: true,
        value: buildWrapper(B, methods[m], m)
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

