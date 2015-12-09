Package.describe({
  name: 'suchipi:irregular',
  version: '1.1.3',
  summary: 'Abstracted, human-readable regular expressions',
  git: 'http://github.com/suchipi/irregular-js',
  documentation: 'README.md'
});

Package.onUse(function(api) {
  api.versionsFrom('1.0');
  api.export('IrRegExp');
  api.addFiles('irregular.js');
});

Package.onTest(function(api) {
  api.use('ecmascript');
  api.use('tinytest');
  api.use('suchipi:irregular');
  api.addFiles('irregular-tests.js');
});
