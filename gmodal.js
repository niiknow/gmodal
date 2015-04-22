(function outer(modules, cache, entries){

  /**
   * Global
   */

  var global = (function(){ return this; })();

  /**
   * Require `name`.
   *
   * @param {String} name
   * @param {Boolean} jumped
   * @api public
   */

  function require(name, jumped){
    if (cache[name]) return cache[name].exports;
    if (modules[name]) return call(name, require);
    throw new Error('cannot find module "' + name + '"');
  }

  /**
   * Call module `id` and cache it.
   *
   * @param {Number} id
   * @param {Function} require
   * @return {Function}
   * @api private
   */

  function call(id, require){
    var m = cache[id] = { exports: {} };
    var mod = modules[id];
    var name = mod[2];
    var fn = mod[0];

    fn.call(m.exports, function(req){
      var dep = modules[id][1][req];
      return require(dep ? dep : req);
    }, m, m.exports, outer, modules, cache, entries);

    // expose as `name`.
    if (name) cache[name] = cache[id];

    return cache[id].exports;
  }

  /**
   * Require all entries exposing them on global if needed.
   */

  for (var id in entries) {
    if (entries[id]) {
      global[entries[id]] = require(id);
    } else {
      require(id);
    }
  }

  /**
   * Duo flag.
   */

  require.duo = true;

  /**
   * Expose cache.
   */

  require.cache = cache;

  /**
   * Expose modules
   */

  require.modules = modules;

  /**
   * Return newest require.
   */

   return require;
})({
1: [function(require, module, exports) {
(function() {
  var Emitter, domify, gmodal, modal, win;

  Emitter = require('emitter');

  domify = require('domify');

  win = window;


  /**
   * modal
   */

  modal = (function() {
    function modal() {}

    modal.prototype.doc = win.document;

    modal.prototype.elWrapper = null;

    modal.prototype.el = null;

    modal.prototype.options = {};

    modal.prototype.baseCls = 'gmodal';

    modal.prototype.closeCls = 'gmodal-close';

    modal.prototype.tpl = '<div class="gmodal-wrap gmodal-top">&nbsp;<div><div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>';

    modal.prototype.css = '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling:touch;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:9999990}.gmodal-show{display:table}.gmodal-content,.gmodal-wrap{display:table-cell}.gmodal-wrap{width:50%}';

    modal.prototype.show = function(options) {
      var self;
      self = this;
      self.elWrapper = self.createModal();
      if (!self.el) {
        self.el = self.doc.getElementById("gmodalContent");
      }
      if ((options != null)) {
        self.options = options;
        if ((self.options.content != null)) {
          while (self.el.firstChild) {
            self.el.removeChild(self.el.firstChild);
          }
          self.el.appendChild(domify(self.options.content));
          self.options.content = null;
        }
      }
      if (!self.options) {
        return self;
      }
      if (self.options.closeCls) {
        self.closeCls = self.options.closeCls;
      }
      self.elWrapper.style.display = self.elWrapper.style.visibility = "";
      self.elWrapper.className = (self.baseCls + " gmodal-show ") + (self.options.cls || '');
      self.emit('show');
      return this;
    };

    modal.prototype.hide = function() {
      var self;
      self = this;
      if (!self.elWrapper) {
        return self;
      }
      self.elWrapper.className = "" + self.baseCls;
      self.emit('hide');
      return this;
    };

    modal.prototype.injectStyle = function(id, data) {
      var el, self;
      self = this;
      el = self.doc.getElementById(id);
      if (!el) {
        el = self.doc.createElement('style');
        el.id = id;
        el.type = 'text/css';
        if (el.styleSheet) {
          el.styleSheet.cssText = data;
        } else {
          el.appendChild(self.doc.createTextNode(data));
        }
        (self.doc.head || self.doc.getElementsByTagName('head')[0]).appendChild(el);
      }
      return this;
    };

    modal.prototype.hasCls = function(el, cls) {
      var i, k, len, ref, v;
      ref = cls.split(' ');
      for (k = i = 0, len = ref.length; i < len; k = ++i) {
        v = ref[k];
        if ((' ' + el.className).indexOf(' ' + v) >= 0) {
          return true;
        }
      }
      return false;
    };

    modal.prototype.checkEvent = function(name, evt, el) {
      var scls, self, tg;
      self = this;
      evt = evt || win.event;
      tg = evt.target || evt.srcElement;
      if (tg.nodeType === 3) {
        tg = tg.parentNode;
      }
      if (self.hasCls(tg.parentNode, "" + self.closeCls)) {
        tg = tg.parentNode;
      }
      scls = "gmodal-wrap " + self.closeCls;
      if (name === 'click') {
        if (self.hasCls(tg, scls) || tg === el) {
          self.emit('click', evt);
        }
      } else if (name === 'keypress') {
        if (self.hasCls(tg, scls) || tg === el || tg === sel.doc || tg === self.doc.body) {
          if ((evt.which || evt.keyCode) === 27) {
            self.emit('esc', evt);
          }
        }
      } else if (name === 'tap') {
        if (self.hasCls(tg, scls) || tg === el) {
          self.emit('tap', evt);
        }
      }
      return false;
    };

    modal.prototype.createModal = function() {
      var el, myKeypress, oldkp, self;
      self = this;
      el = self.doc.getElementById("gmodal");
      if (!el) {
        self.injectStyle('gmodal-css', self.css);
        el = self.doc.createElement('div');
        el.id = 'gmodal';
        el.onclick = function(evt) {
          return self.checkEvent('click', evt, el);
        };
        myKeypress = function(evt) {
          return self.checkEvent('keypress', evt, el);
        };
        el.onkeypress = myKeypress;
        if (typeof self.doc.onkeypress === 'function') {
          oldkp = self.doc.onkeypress;
          self.doc.onkeypress = function(evt) {
            oldkp(evt);
            return myKeypress(evt);
          };
        } else {
          self.doc.onkeypress = myKeypress;
        }
        el.ontap = function(evt) {
          return self.checkEvent('tap', evt, el);
        };
        el.appendChild(domify(self.tpl));
        self.doc.getElementsByTagName('body')[0].appendChild(el);
      }
      return el;
    };

    return modal;

  })();

  Emitter(modal.prototype);

  gmodal = new modal();

  win.gmodal = gmodal;

  module.exports = gmodal;

}).call(this);

}, {"emitter":2,"domify":3}],
2: [function(require, module, exports) {

/**
 * Expose `Emitter`.
 */

module.exports = Emitter;

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

}, {}],
3: [function(require, module, exports) {

/**
 * Expose `parse`.
 */

module.exports = parse;

/**
 * Tests for browser support.
 */

var div = document.createElement('div');
// Setup
div.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
// Make sure that link elements get serialized correctly by innerHTML
// This requires a wrapper element in IE
var innerHTMLBug = !div.getElementsByTagName('link').length;
div = undefined;

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

}, {}]}, {}, {"1":""})
