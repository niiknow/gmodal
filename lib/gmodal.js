/*!
 *  gmodal.js - v2.0.3
 *  build: Fri Jul 21 2017 03:20:01 GMT-0500 (CDT)
 *  a modal
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define("Wu", [], factory);
	else if(typeof exports === 'object')
		exports["Wu"] = factory();
	else
		root["Wu"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
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
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
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
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 5);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /* jshint esversion: 6 */


var _domify = __webpack_require__(2);

var _domify2 = _interopRequireDefault(_domify);

var _componentEmitter = __webpack_require__(1);

var _componentEmitter2 = _interopRequireDefault(_componentEmitter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var templateHtml = __webpack_require__(4);
var templateCss = __webpack_require__(3);
var win = window;

var modals = [];

function hideModalInternal(self) {
  self.elWrapper.className = '' + self.baseCls;
  self.el.className = 'gmodal-wrap gmodal-content';
  setTimeout(function () {
    var eCls = self.doc.getElementsByTagName('html')[0].className;

    self.doc.getElementsByTagName('html')[0].className = self.trim(eCls.replace(/html\-gmodal/gi, ''));
    self.isVisible = false;
    self.emit('hide', self);

    if (typeof self.opts.hideCallback === 'function') {
      self.opts.hideCallback(self);
    }

    if (self.opts._autoHideHandler) {
      self.off('esc', self.opts._autoHideHandler);
      self.off('click', self.opts._autoHideHandler);
      self.off('tap', self.opts._autoHideHandler);
    }

    if (modals.length !== 0) {
      return self.show();
    }
  }, self.opts.timeout || 50);

  return self;
}

function showModalInternal(self, opts) {
  var body = void 0,
      eCls = void 0,
      i = void 0,
      len = void 0,
      ref = void 0,
      v = void 0;

  self.isVisible = true;

  if (opts) {
    self.opts = opts;
    if (self.opts.content) {
      while (self.el.firstChild) {
        self.el.removeChild(self.el.firstChild);
      }

      if (typeof self.opts.content === 'string') {
        if (self.opts.content.indexOf('<!DOCTYPE') > -1 || self.opts.iframe) {
          self.loadiFrame(self.el, self.opts.content, null, 'gmodal-iframe');
        } else {
          self.el.appendChild(self.domify(self.opts.content));
        }
      } else {
        self.el.appendChild(self.opts.content);
      }

      self.opts.content = null;
    }
  }

  self.closeCls = self.opts.closeCls || self.closeCls;
  if (!self.opts.disableScrollTop) {
    win.scrollTo(0, 0);
  }

  self.elWrapper.style.display = self.elWrapper.style.visibility = '';
  self.elWrapper.className = self.trim(self.baseCls + ' ' + (self.opts.cls || ''));

  body = self.doc.getElementsByTagName('html')[0];
  eCls = body.className;
  body.className = self.trim(eCls + ' html-gmodal');

  setTimeout(function () {
    self.emit('show-timeout', self);
    self.el.className = self.trim((' ' + self.el.className + ' ').replace(' in ', '') + ' in');
  }, self.opts.timeout || 50);

  if (self.opts.hideOn) {
    self.opts._autoHideHandler = function () {
      return hideModalInternal(self);
    };
    ref = self.opts.hideOn.split(',');
    for (i = 0, len = ref.length; i < len; i++) {
      v = ref[i];
      if (v === 'esc' || v === 'click' || v === 'tap') {
        self.on(v, self.opts._autoHideHandler);
      }
    }
  }

  self.emit('show', self);
  return self;
}

function checkEvent(self, name, evt, el) {
  var myEvt, scls, tg;

  evt = evt || win.event;
  tg = evt.target || evt.srcElement;
  if (tg.nodeType === 3) {
    tg = tg.parentNode;
  }
  if (self.hasCls(tg.parentNode, '' + self.closeCls)) {
    tg = tg.parentNode;
  }
  scls = 'gmodal-container gmodal-wrap';
  if (name === 'click') {
    if (self.hasCls(tg, scls) || tg === el) {
      self.emit('click', tg, evt);
    }
  } else if (name === 'keypress') {
    if (self.hasCls(tg, scls) || tg === el || tg === self.doc || tg === self.doc.body) {
      if ((evt.which || evt.keyCode) === 27) {
        self.emit('esc', tg, evt);
      }
    }
  } else if (name === 'tap') {
    if (self.hasCls(tg, scls) || tg === el) {
      self.emit('tap', tg, evt);
    }
  }
  if (self.hasCls(tg, '' + self.closeCls)) {
    myEvt = {
      cancel: false
    };
    self.emit('close', myEvt, tg, evt);
    if (!myEvt.cancel) {
      hideModalInternal(self);
    }
  }
  return true;
}

function createModal(self) {
  var el = self.doc.getElementById('gmodal');

  if (!el) {
    self.injectStyle('gmodalcss', self.css);
    el = self.doc.createElement('div');
    el.id = 'gmodal';

    self.addEvent(el, 'click', function (evt) {
      return checkEvent(self, 'click', evt, el);
    });

    self.addEvent(el, 'keypress', function (evt) {
      return checkEvent(self, 'keypress', evt, el);
    });

    if (!self.doc.gmodalAttached) {
      self.addEvent(self.doc, 'keypress', function (evt) {
        return checkEvent(self, 'keypress', evt, el);
      });
      self.doc.gmodalAttached = true;
    }

    self.addEvent(el, 'tap', function (evt) {
      return checkEvent(self, 'tap', evt, el);
    });

    el.appendChild(self.domify(self.tpl));
    self.doc.getElementsByTagName('body')[0].appendChild(el);
  }

  return el;
}

var GModal = function () {
  function GModal() {
    _classCallCheck(this, GModal);

    this.win = window;
    this._name = 'gmodal';
    this.doc = this.win.document;
    this.ishim = null;
    this.elWrapper = null;
    this.el = null;
    this.opts = {};
    this.baseCls = 'gmodal';
    this.closeCls = 'gmodal-close';
    this.tpl = templateHtml;
    this.css = templateCss;
    this.domify = _domify2.default;
    this.emitter = _componentEmitter2.default;
  }

  _createClass(GModal, [{
    key: 'addEvent',


    /**
     * cross browser attach event
     * @param {object} obj     source object
     * @param {string} evtName event name
     * @param {object}         self
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
    key: 'hasCls',
    value: function hasCls(el, cls) {
      var i = void 0,
          k = void 0,
          len = void 0,
          ref = void 0,
          v = void 0;

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
    key: 'injectStyle',
    value: function injectStyle(id, css) {
      var el = void 0,
          elx = void 0,
          self = this;

      el = self.doc.getElementById(id);

      if (!el) {
        el = self.doc.createElement('style');
        el.id = id;
        el.type = 'text/css';
        if (el.styleSheet) {
          el.styleSheet.cssText = css;
        } else {
          el.appendChild(self.doc.createTextNode(css));
        }
        elx = self.doc.getElementsByTagName('link')[0];
        elx = elx || (self.doc.head || self.doc.getElementsByTagName('head')[0]).lastChild;
        elx.parentNode.insertBefore(el, elx);
      }

      return self;
    }

    /**
     * create an iframe
     * @return {object} the iframe
     */

  }, {
    key: 'createiFrame',
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
    key: 'loadiFrame',
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
    key: 'trim',
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
    key: 'show',
    value: function show(opts, hideCb) {
      var ref = void 0,
          self = this;

      if (!((ref = self.doc) ? ref.body : void 0)) {
        return false;
      }

      self.elWrapper = createModal(self);
      if (!self.el) {
        self.el = self.doc.getElementById('gmodalContent');
      }

      if (opts) {
        opts.hideCallback = hideCb;
        modals.push(opts);
      }

      if (self.isVisible) {
        return false;
      }

      if (modals.length > 0) {
        opts = modals.shift();
      }

      if (!opts) {
        return false;
      }

      showModalInternal(self, opts);
      return self;
    }

    /**
     * hide or close modal
     * @return {Object}
     */

  }, {
    key: 'hide',
    value: function hide() {
      var self = this;

      if (!self.elWrapper) {
        return self;
      }

      if (self.opts) {
        hideModalInternal(self);
      }

      return self;
    }

    /**
     * append an iframe shim for older IE
     * WARNING: this is only for stupid older IE bug
     * do not use with modern browser or site with ssl
     * @return {Object}
     */

  }, {
    key: 'iShimmy',
    value: function iShimmy() {
      var self = this;

      if (self.elWrapper && !self.shim) {
        self.ishim = self.doc.createElement('iframe');
        self.ishim.className = 'gmodal-iframeshim';
        self.ishim.frameBorder = '0';
        self.ishim.marginWidth = '0';
        self.ishim.marginHeight = '0';
        self.ishim.scrolling = 'no';
        self.ishim.setAttribute('border', '0');
        self.ishim.height = '100%';
        self.ishim.width = '100%';
        self.elWrapper.appendChild(self.ishim);
      }
      return self;
    }
  }, {
    key: 'name',
    get: function get() {
      return this._name;
    }
  }]);

  return GModal;
}();

var gmodal = new GModal();

if (!gmodal.win.gmodal) {
  (0, _componentEmitter2.default)(GModal.prototype);
  gmodal.win.gmodal = new GModal();
}

module.exports = gmodal.win.gmodal;

/***/ }),
/* 1 */
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
  var args = [].slice.call(arguments, 1)
    , callbacks = this._callbacks['$' + event];

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
/* 2 */
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
/* 3 */
/***/ (function(module, exports) {

module.exports = ".gmodal {\n    display: none;\n    overflow: hidden;\n    outline: 0;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    top: 0;\n    left: 0;\n    width: 100%;\n    height: 200%;\n    z-index: 9999990;  /* based on safari 16777271 */ \n}\n.gmodal .frameshim {\n    position: absolute;\n    display: block;\n    visibility: hidden;\n    width: 100%;\n    height: 100%;\n    margin: 0;\n    top: 0;\n    left: 0;\n    border: none;\n    z-index: -999;\n}\n.html-gmodal body .gmodal { display: block; }\n.html-gmodal, .html-modal body { overflow: hidden; margin:0; padding:0; height:100%; width:100%; }\n.gmodal-container { display: table; position: relative; width: 100%; height: 50%; }\n.gmodal-wrap { display: table-cell; position: relative; vertical-align: middle; }\n.gmodal-left, .gmodal-right { width: 50%; }"

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "<div class=\"gmodal-container\">\n\t<div class=\"gmodal-wrap gmodal-left\"></div>\n\t<div class=\"gmodal-wrap gmodal-content\" id=\"gmodalContent\"></div>\n\t<div class=\"gmodal-wrap gmodal-right\"></div>\n<div>"

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(0);


/***/ })
/******/ ]);
});
//# sourceMappingURL=gmodal.js.map