const Wu = require('wu');
const templateHtml = require('template.html');
const templateCss = require('template.css');

var wu = new Wu(),
  modals = [],
  win = wu.win;

function hideModalInternal(self) {
  self.elWrapper.className = '' + self.baseCls;
  self.el.className = 'gmodal-wrap gmodal-content';
  setTimeout(() => {
    let eCls = self.doc.getElementsByTagName('html')[0].className;

    self.doc.getElementsByTagName('html')[0].className = wu.trim(eCls.replace(/html\-gmodal/gi, ''));
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
};

function showModalInternal(self, opts) {
  let body, eCls, i, len, ref, v;

  self.isVisible = true;

  if (opts != null) {
    self.opts = opts;
    if ((self.opts.content != null)) {
      while (self.el.firstChild) {
        self.el.removeChild(self.el.firstChild);
      }

      if (typeof self.opts.content === 'string') {
        if (self.opts.content.indexOf('<!DOCTYPE') > -1 || self.opts.iframe) {
          wu.loadiFrame(self.el, self.opts.content, null, 'gmodal-iframe');
        } else {
          self.el.appendChild(wu.domify(self.opts.content));
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
  self.elWrapper.className = wu.trim((self.baseCls + ' ') + (self.opts.cls || ''));

  body = self.doc.getElementsByTagName('html')[0];
  eCls = body.className;
  body.className = wu.trim(eCls + ' html-gmodal');

  setTimeout(() => {
    self.emit('show-timeout', self);
    self.el.className = wu.trim((' ' + self.el.className + ' ').replace(' in ', '') + ' in');
  }, self.opts.timeout || 50);

  if (self.opts.hideOn) {
    self.opts._autoHideHandler = () => {
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
};

function checkEvent(self, name, evt, el) {
  var myEvt, scls, tg;

  evt = evt || win.event;
  tg = evt.target || evt.srcElement;
  if (tg.nodeType === 3) {
    tg = tg.parentNode;
  }
  if (wu.hasCls(tg.parentNode, '' + self.closeCls)) {
    tg = tg.parentNode;
  }
  scls = 'gmodal-container gmodal-wrap';
  if (name === 'click') {
    if (wu.hasCls(tg, scls) || tg === el) {
      self.emit('click', tg, evt);
    }
  } else if (name === 'keypress') {
    if (wu.hasCls(tg, scls) || tg === el || tg === self.doc || tg === self.doc.body) {
      if ((evt.which || evt.keyCode) === 27) {
        self.emit('esc', tg, evt);
      }
    }
  } else if (name === 'tap') {
    if (wu.hasCls(tg, scls) || tg === el) {
      self.emit('tap', tg, evt);
    }
  }
  if (wu.hasCls(tg, '' + self.closeCls)) {
    myEvt = {
      cancel: false
    };
    self.emit('close', myEvt, tg, evt);
    if (!myEvt.cancel) {
      hideModalInternal(self);
    }
  }
  return true;
};

function createModal(self) {
  var el = self.doc.getElementById('gmodal');

  if (!el) {
    wu.injectStyle('gmodalcss', self.css);
    el = self.doc.createElement('div');
    el.id = 'gmodal';

    wu.addEvent(el, 'click', (evt) => {
      return checkEvent(self, 'click', evt, el);
    });

    wu.addEvent(el, 'keypress', (evt) => {
      return checkEvent(self, 'keypress', evt, el);
    });

    if (!self.doc.gmodalAttached) {
      wu.addEvent(self.doc, 'keypress', (evt) => {
        return checkEvent(self, 'keypress', evt, el);
      });
      self.doc.gmodalAttached = true;
    }

    wu.addEvent(el, 'tap', (evt) => {
      return checkEvent(self, 'tap', evt, el);
    });

    el.appendChild(wu.domify(self.tpl));
    self.doc.getElementsByTagName('body')[0].appendChild(el);
  }

  return el;
};

class GModal {
  constructor() {
    this._name = 'gmodal';
    this.doc = win.document;
    this.ishim = null;
    this.elWrapper = null;
    this.el = null;
    this.opts = {};
    this.baseCls = 'gmodal';
    this.closeCls = 'gmodal-close';
    this.tpl = templateHtml;
    this.css = templateCss;
    this.wu = wu;
    this.hasCls = wu.hasCls;
    this.injectStyle = wu.injectStyle;
  }

  get name() {
    return this._name;
  }

  /**
   * show or open modal
   * @param  {[Object}  opts   options
   * @param  {Function} hideCb callback function on hide
   * @return {Object}
   */
  show(opts, hideCb) {
    let ref, self = this;

    if (!((ref = self.doc) != null ? ref.body : void 0)) {
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
  hide() {
    let self = this;

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
  iShimmy() {
    let self = this;

    if ((self.elWrapper != null) && !self.shim) {
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
}

if (!wu.win.gmodal) {
  wu.emitter(GModal.prototype);
  wu.win.gmodal = new GModal();
}

module.exports = wu.win.gmodal;
