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
  test1: () => "result1",
  test2: () => "result2"
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

Tinytest.add('IrRegExp.prototype.compile converts named capture groups into unnamed ones', function(test) {
  var regExp = new IrRegExp('(?<foo>bar)').compile();
  test.equal(regExp.source, "(bar)");

  var regExp = new IrRegExp('(?\'foo\'bar)').compile();
  test.equal(regExp.source, "(bar)");
});

Tinytest.add('IrRegExp.prototype.compile converts named capture groups within methods into unnamed ones', function(test) {
  methods = {
    foo: () => "(?<foo>bar)",
    foo2: () => "(?'foo2'bar)"
  }

  var regExp = new IrRegExp('`foo` `foo2`', methods).compile();
  test.equal(regExp.source, "(bar) (bar)");
});

Tinytest.add('IrRegExp.prototype.match returns matches', function(test) {
  var irRegExp = new IrRegExp(/(\w+) (\w+)/);
  matches = irRegExp.match('John Smith');
  test.equal(matches[1][0], 'John');
  test.equal(matches[2][0], 'Smith');
});

Tinytest.add('IrRegExp.prototype.match returns named matches', function(test) {
  var irRegExp = new IrRegExp('(?<firstName>\\w+) (?\'lastName\'\\w+)');
  matches = irRegExp.match('John Smith');
  test.equal(matches.firstName[0], 'John');
  test.equal(matches.lastName[0], 'Smith');
});

Tinytest.add('IrRegExp.prototype.match works with both named and unnamed matching groups', function(test) {
  var irRegExp = new IrRegExp('(?<firstName>\\w+) (\\w+) (?<lastName>\\w+)');
  matches = irRegExp.match('John R Smith');
  test.equal(matches.firstName[0], 'John');
  test.equal(matches[2][0], 'R');
  test.equal(matches.lastName[0], 'Smith');
});

Tinytest.add('IrRegExp.prototype.match aggregates duplicate-named match results to the same key', function(test) {
  var irRegExp = new IrRegExp('(?<namePart>\\w+) (?<namePart>\\w+)');
  matches = irRegExp.match('John Smith');
  test.equal(matches.namePart[0], 'John');
  test.equal(matches.namePart[1], 'Smith');
});

Tinytest.add('IrRegExp.prototype.match aggregates multiple unnamed matches of the same group to the same key when using a global regexp', function(test) {
  var irRegExp = new IrRegExp(/(\w+)/g);
  matches = irRegExp.match('John R Smith'); // calls exec multiple times since the regex is global
  test.equal(matches[1][0], 'John');
  test.equal(matches[1][1], 'R');
  test.equal(matches[1][2], 'Smith');
});

Tinytest.add('IrRegExp.prototype.match aggregates multiple named matches of the same group to the same key when using a global regexp', function(test) {
  var irRegExp = new IrRegExp('(?<namePart>\\w+) ?', 'g');
  matches = irRegExp.match('John R Smith'); // calls exec multiple times since the regex is global
  test.equal(matches.namePart[0], 'John');
  test.equal(matches.namePart[1], 'R');
  test.equal(matches.namePart[2], 'Smith');
});
