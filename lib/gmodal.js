/*!
 * gmodal
 * a modal

 * @version v3.0.1
 * @author Tom Noogen
 * @homepage undefined
 * @repository undefined
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("gmodal", [], factory);
	else if(typeof exports === 'object')
		exports["gmodal"] = factory();
	else
		root["gmodal"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/component-emitter/index.js":
/*!*************************************************!*\
  !*** ./node_modules/component-emitter/index.js ***!
  \*************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {


/**
 * Expose `Emitter`.
 */

if (true) {
  module.exports = Emitter;
}

/**
 * Initialize a new `Emitter`.
 *
 * @api public
 */

function Emitter(obj) {
  if (obj) return mixin(obj);
};

/**
 * Mixin the emitter properties.
 *
 * @param {Object} obj
 * @return {Object}
 * @api private
 */

function mixin(obj) {
  for (var key in Emitter.prototype) {
    obj[key] = Emitter.prototype[key];
  }
  return obj;
}

/**
 * Listen on the given `event` with `fn`.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.on =
Emitter.prototype.addEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};
  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
    .push(fn);
  return this;
};

/**
 * Adds an `event` listener that will be invoked a single
 * time then automatically removed.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.once = function(event, fn){
  function on() {
    this.off(event, on);
    fn.apply(this, arguments);
  }

  on.fn = fn;
  this.on(event, on);
  return this;
};

/**
 * Remove the given callback for `event` or all
 * registered callbacks.
 *
 * @param {String} event
 * @param {Function} fn
 * @return {Emitter}
 * @api public
 */

Emitter.prototype.off =
Emitter.prototype.removeListener =
Emitter.prototype.removeAllListeners =
Emitter.prototype.removeEventListener = function(event, fn){
  this._callbacks = this._callbacks || {};

  // all
  if (0 == arguments.length) {
    this._callbacks = {};
    return this;
  }

  // specific event
  var callbacks = this._callbacks['$' + event];
  if (!callbacks) return this;

  // remove all handlers
  if (1 == arguments.length) {
    delete this._callbacks['$' + event];
    return this;
  }

  // remove specific handler
  var cb;
  for (var i = 0; i < callbacks.length; i++) {
    cb = callbacks[i];
    if (cb === fn || cb.fn === fn) {
      callbacks.splice(i, 1);
      break;
    }
  }

  // Remove event specific arrays for event types that no
  // one is subscribed for to avoid memory leak.
  if (callbacks.length === 0) {
    delete this._callbacks['$' + event];
  }

  return this;
};

/**
 * Emit `event` with the given args.
 *
 * @param {String} event
 * @param {Mixed} ...
 * @return {Emitter}
 */

Emitter.prototype.emit = function(event){
  this._callbacks = this._callbacks || {};

  var args = new Array(arguments.length - 1)
    , callbacks = this._callbacks['$' + event];

  for (var i = 1; i < arguments.length; i++) {
    args[i - 1] = arguments[i];
  }

  if (callbacks) {
    callbacks = callbacks.slice(0);
    for (var i = 0, len = callbacks.length; i < len; ++i) {
      callbacks[i].apply(this, args);
    }
  }

  return this;
};

/**
 * Return array of callbacks for `event`.
 *
 * @param {String} event
 * @return {Array}
 * @api public
 */

Emitter.prototype.listeners = function(event){
  this._callbacks = this._callbacks || {};
  return this._callbacks['$' + event] || [];
};

/**
 * Check if this emitter has `event` handlers.
 *
 * @param {String} event
 * @return {Boolean}
 * @api public
 */

Emitter.prototype.hasListeners = function(event){
  return !! this.listeners(event).length;
};


/***/ }),

/***/ "./node_modules/domify/index.js":
/*!**************************************!*\
  !*** ./node_modules/domify/index.js ***!
  \**************************************/
/*! no static exports found */
/***/ (function(module, exports) {


/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var innerHTMLBug = false;
var bugTestDiv;
if (typeof document !== 'undefined') {
  bugTestDiv = document.createElement('div');
  // Setup
  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
  // Make sure that link elements get serialized correctly by innerHTML
  // This requires a wrapper element in IE
  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
  bugTestDiv = undefined;
}

/**
 * Wrap map from jquery.
 */

var map = {
  legend: [1, '<fieldset>', '</fieldset>'],
  tr: [2, '<table><tbody>', '</tbody></table>'],
  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
  // for script/link/style tags to work in IE6-8, you have to wrap
  // in a div with a non-whitespace character in front, ha!
  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
};

map.td =
map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

map.option =
map.optgroup = [1, '<select multiple="multiple">', '</select>'];

map.thead =
map.tbody =
map.colgroup =
map.caption =
map.tfoot = [1, '<table>', '</table>'];

map.polyline =
map.ellipse =
map.polygon =
map.circle =
map.text =
map.line =
map.path =
map.rect =
map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

/**
 * Parse `html` and return a DOM Node instance, which could be a TextNode,
 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
 * instance, depending on the contents of the `html` string.
 *
 * @param {String} html - HTML string to "domify"
 * @param {Document} doc - The `document` instance to create the Node for
 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
 * @api private
 */

function parse(html, doc) {
  if ('string' != typeof html) throw new TypeError('String expected');

  // default to the global `document` object
  if (!doc) doc = document;

  // tag name
  var m = /<([\w:]+)/.exec(html);
  if (!m) return doc.createTextNode(html);

  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

  var tag = m[1];

  // body support
  if (tag == 'body') {
    var el = doc.createElement('html');
    el.innerHTML = html;
    return el.removeChild(el.lastChild);
  }

  // wrap map
  var wrap = map[tag] || map._default;
  var depth = wrap[0];
  var prefix = wrap[1];
  var suffix = wrap[2];
  var el = doc.createElement('div');
  el.innerHTML = prefix + html + suffix;
  while (depth--) el = el.lastChild;

  // one element
  if (el.firstChild == el.lastChild) {
    return el.removeChild(el.firstChild);
  }

  // several elements
  var fragment = doc.createDocumentFragment();
  while (el.firstChild) {
    fragment.appendChild(el.removeChild(el.firstChild));
  }

  return fragment;
}


/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* WEBPACK VAR INJECTION */(function(global) {/* harmony import */ var _template_tpl__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./template.tpl */ "./src/template.tpl");
/* harmony import */ var _mycss_tpl__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./mycss.tpl */ "./src/mycss.tpl");
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var emitter = __webpack_require__(/*! component-emitter */ "./node_modules/component-emitter/index.js");



var win = global;
var modals = [];

function hideModalInternal(that) {
  that.elWrapper.className = "".concat(that.baseCls || '');
  that.el.className = 'gmodal-wrap gmodal-content';
  setTimeout(function () {
    var eCls = that.doc.getElementsByTagName('html')[0].className;
    that.doc.getElementsByTagName('html')[0].className = that.trim(eCls.replace(/html\-gmodal/gi, ''));
    that.isVisible = false;
    that.emit('hide', that);

    if (typeof that.opts.hideCallback === 'function') {
      that.opts.hideCallback(that);
    }

    if (that.opts._autoHideHandler) {
      that.off('esc', that.opts._autoHideHandler);
      that.off('click', that.opts._autoHideHandler);
      that.off('tap', that.opts._autoHideHandler);
    }

    if (modals.length !== 0) {
      return that.show();
    }

    return that;
  }, that.opts.timeout || 50);
  return that;
}

function showModalInternal(that, opts) {
  var body, eCls, i, len, ref, v;
  that.isVisible = true;

  if (opts) {
    that.opts = opts;

    if (that.opts.content) {
      while (that.el.firstChild) {
        that.el.removeChild(that.el.firstChild);
      }

      if (typeof that.opts.content === 'string') {
        if (that.opts.content.indexOf('<!DOCTYPE') > -1 || that.opts.iframe) {
          that.loadiFrame(that.el, that.opts.content, null, 'gmodal-iframe');
        } else {
          that.el.appendChild(that.domify(that.opts.content));
        }
      } else {
        that.el.appendChild(that.opts.content);
      }

      that.opts.content = null;
    }
  }

  that.closeCls = that.opts.closeCls || that.closeCls;

  if (!that.opts.disableScrollTop) {
    win.scrollTo(0, 0);
  }

  that.elWrapper.style.display = that.elWrapper.style.visibility = '';
  that.elWrapper.className = that.trim(that.baseCls + ' ' + (that.opts.cls || ''));
  body = that.doc.getElementsByTagName('html')[0];
  eCls = body.className;
  body.className = that.trim(eCls + ' html-gmodal');
  setTimeout(function () {
    that.emit('show-timeout', that);
    that.el.className = that.trim(" ".concat(that.el.className, " ").replace(' in ', '') + ' in');
  }, that.opts.timeout || 50);

  if (that.opts.hideOn) {
    that.opts._autoHideHandler = function () {
      return hideModalInternal(that);
    };

    ref = that.opts.hideOn.split(',');

    for (i = 0, len = ref.length; i < len; i++) {
      v = ref[i];

      if (v === 'esc' || v === 'click' || v === 'tap') {
        that.on(v, that.opts._autoHideHandler);
      }
    }
  }

  that.emit('show', that);
  return that;
}

function checkEvent(that, name, evt, el) {
  var myEvt, scls, tg;
  evt = evt || win.event;
  tg = evt.target || evt.srcElement;

  if (tg.nodeType === 3) {
    tg = tg.parentNode;
  }

  if (that.hasCls(tg.parentNode, '' + that.closeCls)) {
    tg = tg.parentNode;
  }

  scls = 'gmodal-container gmodal-wrap';

  if (name === 'click') {
    if (that.hasCls(tg, scls) || tg === el) {
      that.emit('click', tg, evt);
    }
  } else if (name === 'keypress') {
    if (that.hasCls(tg, scls) || tg === el || tg === that.doc || tg === that.doc.body) {
      if ((evt.which || evt.keyCode) === 27) {
        that.emit('esc', tg, evt);
      }
    }
  } else if (name === 'tap') {
    if (that.hasCls(tg, scls) || tg === el) {
      that.emit('tap', tg, evt);
    }
  } else if (name === 'keydown') {
    // if not allow background focus, prevent tab
    if (!that.opts.allowBackgroundFocus && that.el && that.isVisible && (evt.which || evt.keyCode) === 9) {
      if (that.el.contains && !that.el.contains(tg)) {
        evt.preventDefault();
        return false;
      }
    }
  }

  if (that.hasCls(tg, '' + that.closeCls)) {
    myEvt = {
      cancel: false
    };
    that.emit('close', myEvt, tg, evt);

    if (!myEvt.cancel) {
      hideModalInternal(that);
    }
  }

  return true;
}

function createModal(that) {
  var el = that.doc.getElementById('gmodal');

  if (!el) {
    that.injectStyle('gmodalcss', that.css);
    el = that.doc.createElement('div');
    el.id = 'gmodal';

    if (el.setAttribute) {
      el.setAttribute('aria-modal', 'true');
      el.setAttribute('role', 'dialog');
      el.setAttribute('aria-labelledby', 'modalTitle');
    } else {
      el['aria-modal'] = 'true';
      el['role'] = 'dialog';
      el['aria-labelledby'] = 'modalTitle';
    }

    ;
    that.addEvent(el, 'click', function (evt) {
      return checkEvent(that, 'click', evt, el);
    });
    that.addEvent(el, 'keypress', function (evt) {
      return checkEvent(that, 'keypress', evt, el);
    });

    if (!that.doc.gmodalAttached) {
      that.addEvent(that.doc, 'keypress', function (evt) {
        return checkEvent(that, 'keypress', evt, el);
      });
      that.addEvent(that.doc, 'keydown', function (evt) {
        return checkEvent(that, 'keydown', evt, el);
      });
      that.doc.gmodalAttached = true;
    }

    that.addEvent(el, 'tap', function (evt) {
      return checkEvent(that, 'tap', evt, el);
    });
    el.appendChild(that.domify(that.tpl));
    that.doc.getElementsByTagName('body')[0].appendChild(el);
  }

  return el;
}

var GModal =
/*#__PURE__*/
function () {
  function GModal() {
    _classCallCheck(this, GModal);

    var that = this;
    that.win = window;
    that._name = 'gmodal';
    that.doc = this.win.document;
    that.ishim = null;
    that.elWrapper = null;
    that.el = null;
    that.opts = {};
    that.baseCls = 'gmodal';
    that.closeCls = 'gmodal-close';
    that.tpl = _template_tpl__WEBPACK_IMPORTED_MODULE_0__["default"];
    that.css = _mycss_tpl__WEBPACK_IMPORTED_MODULE_1__["default"];
    that.domify = __webpack_require__(/*! domify */ "./node_modules/domify/index.js");
    that.emitter = emitter;
    that.isVisible = false;
  }

  _createClass(GModal, [{
    key: "addEvent",

    /**
     * cross browser attach event
     * @param {object} obj     source object
     * @param {string} evtName event name
     * @param {object}         that
     */
    value: function addEvent(obj, evtName, func) {
      if (obj.addEventListener) {
        obj.addEventListener(evtName, func, false);
      } else if (obj.attachEvent) {
        obj.attachEvent(evtName, func);
      } else if (this.getAttr(obj, 'on' + evtName)) {
        obj['on' + evtName] = func;
      } else {
        obj[evtName] = func;
      }

      return this;
    }
    /**
     * helper method to determine if an element has class
     * @param  {HTMLElement}  el
     * @param  {string}       cls class names
     * @return {Boolean}
     */

  }, {
    key: "hasCls",
    value: function hasCls(el, cls) {
      var i, k, len, ref, v;
      ref = cls.split(' ');

      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        v = ref[k];

        if ((' ' + el.className + ' ').indexOf(' ' + v + ' ') >= 0) {
          return true;
        }
      }

      return false;
    }
    /**
     * Helper method to inject your own css.
     * You must first create the element
     * and property it with an id.
     * @param  {string} id  css id
     * @param  {string} css the css text
     * @return {Object}
     */

  }, {
    key: "injectStyle",
    value: function injectStyle(id, css) {
      var el,
          elx,
          that = this;
      el = that.doc.getElementById(id);

      if (!el) {
        el = that.doc.createElement('style');
        el.id = id;
        el.type = 'text/css';

        if (el.styleSheet) {
          el.styleSheet.cssText = css;
        } else {
          el.appendChild(that.doc.createTextNode(css));
        }

        elx = that.doc.getElementsByTagName('link')[0];
        elx = elx || (that.doc.head || that.doc.getElementsByTagName('head')[0]).lastChild;
        elx.parentNode.insertBefore(el, elx);
      }

      return that;
    }
    /**
     * create an iframe
     * @return {object} the iframe
     */

  }, {
    key: "createiFrame",
    value: function createiFrame(id, className) {
      var iframe = this.doc.createElement('iframe');
      if (id) iframe.id = id;
      if (className) iframe.className = className;
      iframe.frameBorder = '0';
      iframe.marginWidth = '0';
      iframe.marginHeight = '0';
      iframe.setAttribute('border', '0');
      iframe.setAttribute('allowtransparency', 'true');
      iframe.width = '100%';
      iframe.height = '100%';
      return iframe;
    }
    /**
     * helper method to load an iframe
     * @param  {HTMLElement} parentEl  the element
     * @param  {string} html      the html string
     * @param  {string} id        element id
     * @param  {string} className element class names
     * @return {HTMLElement}           the iframe
     */

  }, {
    key: "loadiFrame",
    value: function loadiFrame(parentEl, html, id, className) {
      var iframe = this.createiFrame(id, className);
      parentEl[0].appendChild(iframe);
      /* jshint scripturl: true */

      if (iframe.contentWindow) {
        iframe.contentWindow.contents = html;
        iframe.src = 'javascript:window["contents"]';
      } else {
        var doc = iframe.contentDocument || iframe.document;
        doc.open();
        doc.write(html);
        doc.close();
      }

      return iframe;
    } // loadiFrame

    /**
     * trim string
     * @param  {string} str the string
     * @return {string}     trimmed result
     */

  }, {
    key: "trim",
    value: function trim(str) {
      return str.trim ? str.trim() : str.replace(/^\s*|\s*$/g, '');
    }
    /**
     * show or open modal
     * @param  {[Object}  opts   options
     * @param  {Function} hideCb callback function on hide
     * @return {Object}
     */

  }, {
    key: "show",
    value: function show(opts, hideCb) {
      var that = this;
      var ref = that.doc;

      if (!ref && !ref.body) {
        return false;
      }

      that.elWrapper = createModal(that);

      if (!that.el) {
        that.el = that.doc.getElementById('gmodalContent');
      }

      if (opts) {
        opts.hideCallback = hideCb;
        modals.push(opts);
      }

      if (that.isVisible) {
        return false;
      }

      if (modals.length > 0) {
        opts = modals.shift();
      }

      if (!opts) {
        return false;
      }

      showModalInternal(that, opts);
      return that;
    }
    /**
     * hide or close modal
     * @return {Object}
     */

  }, {
    key: "hide",
    value: function hide() {
      var that = this;

      if (!that.elWrapper) {
        return that;
      }

      if (that.opts) {
        hideModalInternal(that);
      }

      return that;
    }
  }, {
    key: "name",
    get: function get() {
      return this._name;
    }
  }]);

  return GModal;
}();

emitter(GModal.prototype);
/* harmony default export */ __webpack_exports__["default"] = (new GModal());
/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../node_modules/webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./src/mycss.tpl":
/*!***********************!*\
  !*** ./src/mycss.tpl ***!
  \***********************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (".gmodal {\n    display: none;\n    overflow: hidden;\n    outline: 0;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 200%;\n    z-index: 9999990;  /* based on safari 16777271 */ \n}\n.gmodal .frameshim {\n    position: absolute;\n    display: block;\n    visibility: hidden;\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    top: 0;\n    left: 0;\n    border: none;\n    z-index: -999;\n}\n.html-gmodal body .gmodal { display: block; }\n.html-gmodal, .html-modal body { overflow: hidden; margin:0; padding:0; height:100%; width:100%; }\n.gmodal-container { display: table; position: relative; width: 100%; height: 50%; }\n.gmodal-wrap { display: table-cell; position: relative; vertical-align: middle; }\n.gmodal-left, .gmodal-right { width: 50%; }");

/***/ }),

/***/ "./src/template.tpl":
/*!**************************!*\
  !*** ./src/template.tpl ***!
  \**************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = ("<div class=\"gmodal-container\">\n\t<div class=\"gmodal-wrap gmodal-left\"></div>\n\t<div class=\"gmodal-wrap gmodal-content\" id=\"gmodalContent\"></div>\n\t<div class=\"gmodal-wrap gmodal-right\"></div>\n<div>");

/***/ }),

/***/ 0:
/*!****************************!*\
  !*** multi ./src/index.js ***!
  \****************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! /Users/tomnoogen/Desktop/work/niiknow/gmodal/src/index.js */"./src/index.js");


/***/ })

/******/ })["default"];
});
//# sourceMappingURL=gmodal.js.map