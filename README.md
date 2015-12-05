# Irregular.js

Regular expressions are very powerful, but their syntax can get large and archaic quickly. Irregular is a simple templating language for regular expressions. It helps you abstract chunks of your regular expressions into functions to help make them more readable. 

## Usage Example

```javascript
  var methods = {
    catNames: function() {
      // Return a string chunk that will be included in the regular expression.
      return '(' + ['betty', 'joyce', 'franklin', 'peter'].join('|') + ')';
    }
  }

  // Insert method results using backticks
  var irRegExp = new IrRegExp(/I love my cat `catNames`!/i, methods);

  // Compile the irregular expression into a regular one
  var regExp = irRegExp.compile();
  console.log(regExp); // /I love my cat (betty|joyce|franklin|peter)!/i

  // Use your regular expression like normal
  console.log(regExp.test("I love my cat Joyce!")); // => true

```

## Installation
* Bower: `bower install --save irregular`
* Meteor: `meteor add suchipi:irregular`

## API

### IrRegExp

An Irregular Expression object.

#### Constructor
```
new IrRegExp(regExp[, flags][, methods])
new IrRegExp(pattern[, flags][, methods])
```
##### Parameters
`regExp`

  A native regular expression object. (RegExp)
  
  Example: `/\$100/gm`

`pattern`

  The text of a regular expression object, the same as you would put in a `new RegExp(pattern[, flags])` constructor. (String)

  Example: `"\\$100"`

`flags`

  The flags of a regular expression object, the same as you would put in a `new RegExp(pattern[, flags])` constructor. (String)

  If you provide a regExp and flags, the flags String will override the flags in the regExp object.
  Example: `'gm'`

`methods`

  An Object containing methods to be used by the Irregular Expression. (Object<String, Function>)

  Each function should return a String representing a portion of a regular expression pattern.
  Example:
  ```javascript
  {
    money: function() {
      // note the use of double-backslashes, because we want the string to contain backslash itself
      return "\\$\\d+(?:\\.\\d{2})?"
    }
  }
  ```
### IrRegExp.prototype.compile
```
irRegExp.compile([methods])
```

Function that compiles the IrRegExp instance into a RegExp. (Returns RegExp)
Takes an optional methods parameter to use instead of the instance's methods. 

### IrRegExp.prototype.flags

A string that contains the regular expression flags of the IrRegExp object. (String)

### IrRegExp.prototype.source

A string that contains the uncompiled pattern of the IrRegExp object. (String)

### IrRegExp.prototype.methods

An object that contains the methods this IrRegExp object will use to compile its source, or `undefined` if this IrRegExp doesn't have any associated methods. (Object<String, Function>)

## Using to create dynamic Regular Expressions

One of the most powerful features of Irregular is its ability to aid you in creating dynamic regular expressions. See the following example:

```javascript
var friends = ['john'];
var irRegExp = new IrRegExp(/(`friendName`)/ig, {
  friendName: function() {
    return friends.join('|');
  }
});

irRegExp.compile().test('george'); // => false
friends.push('george');
irRegExp.compile().test('george'); // => true
```

Because the methods of an IrRegExp are re-evaluated at compile-time, you can create methods that rely on other values and then just recompile your IrRegExp instance to update them.

## TODO

* Ability to escape backtick character with backslash
* Named capture groups that get returned as an Object
* Mirror RegExp prototype API to IrRegExp?

## Contributing

Pull requests, bug reports welcome

## Running tests

Tests are written using Meteor's Tinytest. To run, install meteor and then:
```
$ meteor test-packages ./
```

## License

MIT
