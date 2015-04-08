var tests = [];
for (var file in window.__karma__.files) {
  if (window.__karma__.files.hasOwnProperty(file)) {
    if (/Spec\.js$/.test(file)) {
      tests.push('.' + file+'?'+window.__karma__.files[file]);
    }
  }
}

requirejs.config({
  // Karma serves files from '/base'
  baseUrl: '/',

  paths: {
    chance: 'base/bower_components/chance/chance',
    'es6-shim': 'base/bower_components/es6-shim/es6-shim'
  },

  shim: {
  },

  // ask Require.js to load these files (all our tests)
  deps: (tests.push('es6-shim'),tests),

  // start test run, once Require.js is done
  callback: window.__karma__.start
});