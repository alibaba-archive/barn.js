import * as barn from '../src/barn'

if (typeof define === 'function' && define.amd) {
  define([], function () {
    return barn.default
  });
} else {
  window.barn = barn.default
}