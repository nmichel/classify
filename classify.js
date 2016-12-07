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
      var params = Array.prototype.slice.call(arguments);
      var oldsuper = this.super;
      this.super = super_;
      var r = what.apply(this, params);
      this.super = oldsuper;
      return r;
    }
  };

  var buildCtorFunction = function(base, ctor) {
    var clazz = function() {
      var params = Array.prototype.slice.call(arguments);
      var oldsuper = this.super;
      this.super = base;
      ctor.apply(this, params);
      this.super = oldsuper;
    };
    clazz.prototype = new base;
    clazz.prototype.constructor = clazz;

    return clazz;
  };

  var attachMethods = function(base, clazz, methods) {
    var props = {};
    for (var m in methods) {
      props[m] = {
        enumerable: true,
        value: buildWrapper(base, methods[m], m)
      };
    }
    Object.defineProperties(clazz.prototype, props);
  };

  var attachFunctions = function(clazz, functions) {
    var props = {};
    for (var m in functions) {
      props[m] = {
        enumerable: true,
        value: functions[m].bind(clazz)
      };
    }
    Object.defineProperties(clazz, props);
  };

  var buildClass = function(desc) {
    var base = desc.extend || Object;
    var ctor = desc.ctor || defaultCtor;
    var methods = desc.methods || {};
    var functions = desc.functions || {};

    var clazz = buildCtorFunction(base, ctor);
    attachMethods(base, clazz, methods);
    attachFunctions(clazz, functions);

    return clazz;
  }

  if (typeof window !== 'undefined') {
    window.buildClass = buildClass;
  }
  else if (typeof module !== 'undefined' && module.exports) {
    module.exports = buildClass;
  }

})();

