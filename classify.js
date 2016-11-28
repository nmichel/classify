var defaultCtor = function() {
    this.super();
};

function buildClass(desc) {
  var B = desc.extend || Object;
  var ctor = desc.ctor || defaultCtor;

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

    return function() {
      var params = [].splice.call(arguments, 0);
      return fn.apply(this, params);
    };
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
  };
  clazz.prototype = new B;
  clazz.prototype.constructor = clazz;

  var methods = desc.methods;
  var props = {};
  if (methods !== undefined && typeof methods === 'object') {
    for (var m in methods) {
      props[m] = {
          enumerable: true,
          value: buildWrapper(methods[m], m)
      };
    }
  }
  Object.defineProperties(clazz.prototype, props);

  return clazz;
}
