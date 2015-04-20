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
  var $baseCls, $closeCls, $css, $doc, $tpl, $win, Emitter, createModal, hasCls, injectStyle, modal, result;

  Emitter = require('emitter');

  $tpl = '<div class="gmodal-wrap gmodal-top">&nbsp;<div>\n<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>';

  $css = '.gmodal {\n    display: none;\n    overflow: hidden;\n    outline: 0;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 9999990;  /* based on safari 16777271 */ \n}\n.gmodal-show { display: table }\n.gmodal-wrap,\n.gmodal-content {\n    display: table-cell;\n    width: 33%;\n}';

  $win = window;

  $doc = $win.document;

  $baseCls = 'gmodal';

  $closeCls = 'gmodal-close';

  injectStyle = function(id, data) {
    var el;
    el = $doc.getElementById(id);
    if (!el) {
      el = $doc.createElement('style');
      el.type = 'text/css';
      el.appendChild($doc.createTextNode(data));
      return ($doc.head || $doc.getElementsByTagName('head')[0]).appendChild(el);
    }
  };

  hasCls = function(el, cls) {
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

  createModal = function() {
    var el, myKeypress;
    el = $doc.getElementById("gmodal");
    if (!el) {
      injectStyle('gmodal-css', $css);
      el = $doc.createElement('div');
      el.id = 'gmodal';
      el.onclick = function(evt) {
        evt = evt || $win.event;
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, "gmodal-wrap " + $closeCls) || evt.target === el) {
          gmodal.emit('click', evt);
        }
        return false;
      };
      myKeypress = function(evt) {
        evt = evt || $win.event;
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, "gmodal-wrap") || evt.target === el || evt.target === $doc || evt.target === $doc.body) {
          if ((evt.which || evt.keyCode) === 27) {
            gmodal.emit('esc', evt);
          }
        }
        return false;
      };
      el.onkeypress = myKeypress;
      $doc.onkeypress = myKeypress;
      el.ontap = function(evt) {
        evt = evt || $win.event;
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, "gmodal-wrap " + $closeCls) || evt.target === el) {
          gmodal.emit('tap', evt);
        }
        return false;
      };
      el.innerHTML = $tpl;
      $doc.getElementsByTagName('body')[0].appendChild(el);
    }
    return el;
  };


  /**
   * modal
   */

  modal = (function() {
    function modal() {}

    modal.prototype.elWrapper = null;

    modal.prototype.el = null;

    modal.prototype.options = {};

    modal.prototype.show = function(options) {
      var self;
      self = this;
      self.elWrapper = createModal();
      if (!self.el) {
        self.el = $doc.getElementById("gmodalContent");
      }
      if ((options != null)) {
        self.options = options;
        if ((self.options.content != null)) {
          self.el.innerHTML = self.options.content;
          self.options.content = null;
        }
      }
      if (!self.options) {
        return self;
      }
      if (self.options.closeCls) {
        $closeCls = self.options.closeCls;
      }
      self.elWrapper.style.display = self.elWrapper.style.visibility = "";
      self.elWrapper.className = ($baseCls + " gmodal-show ") + (self.options.cls || '');
      self.emit('show');
      return this;
    };

    modal.prototype.hide = function() {
      var self;
      self = this;
      if (!self.elWrapper) {
        return self;
      }
      self.elWrapper.className = "" + $baseCls;
      self.emit('hide');
      return this;
    };

    modal.prototype.injectStyle = injectStyle;

    modal.prototype.hasCls = hasCls;

    return modal;

  })();

  Emitter(modal.prototype);

  result = new modal();

  $win.gmodal = result;

  module.exports = result;

}).call(this);

}, {"emitter":2}],
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

}, {}]}, {}, {"1":""})
