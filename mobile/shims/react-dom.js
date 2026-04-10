'use strict';
// Shim: @react-aria imports react-dom/flushSync but we're in React Native.
// Replace with a synchronous passthrough so nothing breaks.
exports.flushSync = function (fn) { return fn(); };
exports.createPortal = function (children) { return children; };
exports.render = function () {};
exports.unmountComponentAtNode = function () {};
