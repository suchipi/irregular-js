Tinytest.add('calling IrRegExp without the new keyword throws an error', function(test) {
  test.throws(function(){
    var thing = IrRegExp();
  }, Error);
});

Tinytest.add('An IrRegExp can be constructed without arguments, but not compiled', function(test) {
  var noArgs = new IrRegExp;
  test.isUndefined(noArgs.source);
  test.equal(noArgs.flags, ''); // Defaults to blank
  test.isUndefined(noArgs.methods);
  test.throws(noArgs.compile, Error); // You need a source pattern in order to compile.
});

var methods = {
  test1: function(){ return "result1"; },
  test2: function(){ return "result2"; }
};

Tinytest.add('An IrRegExp can be constructed with a RegExp', function(test) {
  var irRegExp = new IrRegExp(/test/gi);
  test.equal(irRegExp.source, 'test');
  test.equal(irRegExp.flags, 'gi');
  test.isUndefined(irRegExp.methods);
});

Tinytest.add('An IrRegExp can be constructed with a RegExp and flag string', function(test) {
  var irRegExp = new IrRegExp(/test/g, 'gim');
  test.equal(irRegExp.source, 'test');
  test.equal(irRegExp.flags, 'gim'); // Overrides the regExp flags
  test.isUndefined(irRegExp.methods);
});

Tinytest.add('An IrRegExp can be constructed with a RegExp and methods', function(test) {
  var irRegExp = new IrRegExp(/test/gi, methods);
  test.equal(irRegExp.source, 'test');
  test.equal(irRegExp.flags, 'gi');
  test.equal(irRegExp.methods, methods);
});

Tinytest.add('An IrRegExp can be constructed with a RegExp, flag string, and methods', function(test) {
  var irRegExp = new IrRegExp(/test/g, 'gim', methods);
  test.equal(irRegExp.source, 'test');
  test.equal(irRegExp.flags, 'gim'); // Overrides the regExp flags
  test.equal(irRegExp.methods, methods);
});

Tinytest.add('An IrRegExp can be constructed with a pattern string', function(test) {
  var irRegExp = new IrRegExp('test');
  test.equal(irRegExp.source, 'test');
  test.equal(irRegExp.flags, ''); // Defaults to blank
  test.isUndefined(irRegExp.methods);
});

Tinytest.add('An IrRegExp can be constructed with a pattern string and flag string', function(test) {
  var irRegExp = new IrRegExp('test', 'gim');
  test.equal(irRegExp.source, 'test');
  test.equal(irRegExp.flags, 'gim');
  test.isUndefined(irRegExp.methods);

  var sourceStringAndMethods = new IrRegExp('test', methods)
});

Tinytest.add('IrRegExp.prototype._getFlags gets the flags of a RegExp', function(test) {
  var getFlags = IrRegExp.prototype._getFlags;

  var regExp = /bla/g;
  test.equal(getFlags(regExp), 'g');

  var regExp = /bla/ig;
  test.equal(getFlags(regExp), 'gi');

  var regExp = /bla/mi;
  test.equal(getFlags(regExp), 'im');

  var regExp = /bla/mg;
  test.equal(getFlags(regExp), 'gm');

  var regExp = /bla/gim;
  test.equal(getFlags(regExp), 'gim');
});

Tinytest.add('IrRegExp.prototype.compile returns a compiled RegExp', function(test) {
  var irRegExp = new IrRegExp(/`test1` `test2`-`test1`/ig, methods);
  var regExp = irRegExp.compile();
  
  test.instanceOf(regExp, RegExp);
  test.equal(regExp.source, "result1 result2-result1");
  test.isTrue(regExp.ignoreCase);
  test.isTrue(regExp.global);
  test.isFalse(regExp.multiline);
});

Tinytest.add('Trying to compile a non-existent method does nothing', function(test) {
  test.isUndefined(methods.foo);
  var regExp = new IrRegExp(/bla `foo`/, methods).compile();
  test.equal(regExp.source, "bla `foo`");
});
