IrRegExp = function() {
  if (!(this instanceof IrRegExp)) {
    throw new Error("Use the 'new' keyword to instantiate an IrRegExp");
    return;
  }
  var regExp, sourceStr, flagStr, methods;

  if (arguments[0] instanceof RegExp) {
    regExp = arguments[0];
  } else if (typeof arguments[0] === "string") {
    sourceStr = arguments[0];
  }

  if (typeof arguments[1] === "string") {
    flagStr = arguments[1];
  } else if (arguments[1] instanceof Object) {
    methods = arguments[1];
  }

  if (arguments[2] instanceof Object) {
    methods = arguments[2];
  }

  if (regExp) {
    this.source = regExp.source;
    this.flags = this._getFlags(regExp);
  }

  if (sourceStr)
    this.source = sourceStr;

  if (flagStr)
    this.flags = flagStr;

  if (methods)
    this.methods = methods;

  if (!this.flags)
    this.flags = "";
};

IrRegExp.prototype._getFlags = function(regExp) {
  if (regExp.flags) {
    return regExp.flags;
  }
  var list = [];
  if (regExp.global) list.push('g');
  if (regExp.ignoreCase) list.push('i');
  if (regExp.multiline) list.push('m');
  if (regExp.unicode) list.push('u');
  if (regExp.sticky) list.push('y');
  return list.join('');
};

IrRegExp.prototype.compile = function(providedMethods) {
  var self = this;

  if (typeof self.source === "undefined")
    throw new Error("No source pattern was defined for this IrRegExp; cannot compile");

  var compiledSource = self.source;
  var methods = providedMethods || self.methods || {};

  Object.keys(methods).forEach(function(method){
    compiledSource = compiledSource.replace(/`(\w+)`/g, function(match, $1, offset){
      var func = methods[$1] || function(){return match};
      return func();
    });
  });

  // strip out named capture groups by converting them into normal capture groups
  compiledSource = compiledSource.replace(/\(\?(?:<|')\w+(?:>|')([^)]*)\)/g, "($1)");

  return new RegExp(compiledSource, self.flags);
};

IrRegExp.prototype.match = function(matchString) {
  var self = this;

  // Collect capture group names
  var matchNames = [];
  self.source.replace(/\([^)]*\)/g, function(match, offset){
    var namedMatchMatches = /\(\?(?:<|')(\w+)(?:>|')[^)]*\)/g.exec(match);
    if (namedMatchMatches) {
      matchNames.push(namedMatchMatches[1]);
    } else {
      // Unnamed capture group; you can get it via number, though.
      matchNames.push(matchNames.length + 1);
    }
  });

  // Collect match results. exec global regExps until they're all done.
  var regExp = self.compile();
  var matchResults = [];
  if (regExp.global) {
    while(regExp.lastIndex < matchString.length) {
      var matches = regExp.exec(matchString);
      if (matches) matchResults.push(matches);
    }
  } else {
    var matches = regExp.exec(matchString);
    if (matches) matchResults.push(matches);
  }

  // populate matches from matchResults into a map.
  // keys are matching group names, values are arrays of matches.
  var matchMap = {};
  matchResults.forEach(function(matches){
    matchNames.forEach(function(name, index){
      if (!matchMap[name]) matchMap[name] = [];
      matchMap[name].push(matches[index + 1]);
    });
  });
  return matchMap;
};
