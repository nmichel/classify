(function() {
  var buildClass = null;
  if (typeof require !== 'undefined') {
    buildClass = require('./classify.js');
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
    },

    methods: {
      foo: function(v) {
        return this.super(v) * 4;
      },

      bar: function(t, v) {
        return '' + t + ': ' + this.foo(v);
      }
    }
  });

  var f = new F(42);
  var h = new H(14, 42);

  console.log(f.foo(5));
  console.log(h.foo(5));
  console.log(h.bar('Res', 5));
})();
