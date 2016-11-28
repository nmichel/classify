var F = function() {};
F.prototype = {};
Object.defineProperties(F.prototype, {
  'foo': {
    value: true,
    writable: true
  }
});
F.globalFn = (function() {
  return this.foo
}).bind(F.prototype);
F.globalFn();
var f = new F();
f.foo;

