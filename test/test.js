(function() {
  var buildClass = null;
  if (typeof require !== 'undefined') {
    buildClass = require('../classify.js');
  } else if (typeof window !== 'undefined') {
    buildClass = window.buildClass;
  }

  var F = buildClass({
      functions: {
        foo: function(v) {
            return this.bar() * v;
        },

        bar: function() {
            return 42;
        }
    },

    ctor: function(v) {
      this.super();
      this.f = v;
    },

    methods: {
      foo: function(v) {
        return this.f * v;
      }
    }
  });

  var G = buildClass({
    extend: F,

    ctor: function(g, f) {
      this.super(f);
      this.g = g;
    }
  });

  var H = buildClass({
    extend: G,

    ctor: function(g, f) {
      this.super(g, f);
      this.newProp = 'someValue';
    },

    methods: {
      foo: function(v) {
        return this.super(v) * 4;
      },

      bar: function(t, v) {
        this.newProperty = 32;
        return '' + t + ': ' + this.foo(v);
      }
    }
  });

  var f = new F(42);
  var g = new F(12);
  var h = new H(14, 42);

  console.log('f.foo(5)', f.foo(5));

  console.log('g.foo(5)', g.foo(5));
  g.anotherProp = 'anotherValue';
  console.log('g.anotherProp', g.anotherProp);

  console.log('h.foo(5)', h.foo(5));
  console.log('h.bar(\'Res\', 5)', h.bar('Res', 5));
  console.log('h.newProp', h.newProp);
  h.anotherProp = 42;
  console.log('h.anotherProp', h.anotherProp);
  
  console.log(F.foo(42));
  // console.log(H.foo(42)); /* Nope ! Class functions are not inherited */
})();
