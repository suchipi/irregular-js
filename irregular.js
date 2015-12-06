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
    compiledSource = self.source.replace(/`(\w+)`/g, function(match, $1, offset){
      var func = methods[$1] || function(){return match};
      return func();
    });
  });

  return new RegExp(compiledSource, self.flags);
};
