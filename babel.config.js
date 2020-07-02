module.exports = {
  presets: ['@vue/cli-plugin-babel/preset']  // uses babel-preset-app
};


// @vue/babel-preset-app:
/* This is the default Babel preset used in all Vue CLI projects. Note: this preset is meant to be used exclusively in projects created via Vue CLI and does not consider external use cases.

Included Features
@babel/preset-env
preset-env automatically determines the transforms and polyfills to apply based on your browser target. See Browser Compatibility section in docs for more details.

modules: false
auto set to 'commonjs' in Jest tests
useBuiltIns: 'usage'
targets is determined:
using browserslist field in package.json when building for browsers
set to { node: 'current' } when running unit tests in Node.js
Includes Promise polyfill by default so that they are usable even in non-transpiled dependencies (only for environments that need it) */