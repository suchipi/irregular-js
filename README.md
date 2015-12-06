# Irregular.js

Regular expressions are very powerful, but they can get large and archaic quickly. Irregular provides tools that work together to help you abstract your regular expressions into human-readable code.

Irregular comes with:
* A templating language for Regular Expressions that helps you abstract each chunk into a human-readable string
* Support for named capture groups (.NET syntax: `(?<name>pattern)` or `(?'name'pattern)`)
* A convenient method to retrieve all matches from an IrRegExp (no more while loops!)

There is also a Ruby implementation: [irregular-rb](https://github.com/suchipi/irregular-rb)

## Usage Example

### Templating
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

### Match Retrieval
```javascript
  var irRegExp = new IrRegExp(/(\w+)/g);
  var matches = irRegExp.match("This is a test");
  console.log(matches); // => { '1': ["This", "is", "a", "test"] }
  console.log(matches[1][0]); // => "This"

  var namedIrRegExp = new IrRegExp('(?<firstName>\\w+) (?<lastName>\\w+)'); // IrRegExp supports named matches!
  var matches = irRegExp.match("John Smith");
  console.log(matches); // => { firstName: ["John"], lastName: ["Smith"] }
```

Templating and Match Retrieval can be used together.

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

  An Object containing methods to be used by the Irregular Expression. (Object&lt;String, Function&gt;)

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
If the IrRegExp being compiled contains named capture groups, they will be converted into unnamed capture groups.

### IrRegExp.prototype.match
```
irRegExp.match(string)
```

Function that returns the matches of the IrRegExp instance. (Returns Object&lt;String, Array&lt;String&gt;&gt;)

Format of the returned object is:
```
{
  <captureGroupNameOrNumber>: [<matches>]
}
```

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
