(function() {

    /* A is a class without any declared base class.
       By default, it inherits from Object.
     */
    var A = buildClass({
        /* Class constructor.
         */
        ctor: function(p) {
            this.p = ...
        },

        /* Methods definitions.
         * A method is called with "this" bound to a class instance.
         */
        methods: {
            /* Method "echo".
             */
            echo: function(v) {
                return ...;
            }
        },

        /* Class A functions definitions.
         * A function is called with "this" bound to the class function A.
         */
        functions: {
            foo: function(v) {
                return ...
            }
        }
    });

    /* B is child class of A.
     */
    var B = buildClass({
        /* Class constructor.
         * this.super if bound to A constructor function.
         */
        ctor: function(p, q) {
            ...
            this.super(p);
            this.q = q ...
            ...
        },

        /* Methods definitions.
         */
        methods: {
            /* Method "echo" overrides base class version.
             * In its context this.super is bound to nearest base class version of echo. 
             */
            echo: function(v) {
                ...
                var r =  this.super(v) ... ;
                ... 
                return r;
            }
        },

        /* Class B functions definitions.
         * In B function calls, "this" is bound to class function B.
         */
        functions: {
            foo: function(v) {
                return ...
            }
        }
    });

    /*
     * Usage
     */
    var a = new A(42);
    a.foo(42);
    A.foo(42);

    var b = new B(42);
    b.foo(42);
    B.foo(42);
    
})();
