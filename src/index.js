const emitter = require('component-emitter');

import templateHtml from './template.tpl';
import templateCss from './mycss.tpl';

const win = global;
const modals = [];

function hideModalInternal(that) {
  that.elWrapper.className = `${that.baseCls || ''}`;
  that.el.className = 'gmodal-wrap gmodal-content';

  setTimeout(() => {
    let eCls = that.doc.getElementsByTagName('html')[ 0 ].className;

    that.doc.getElementsByTagName('html')[ 0 ].className = that.trim(eCls.replace(/html\-gmodal/gi, ''));
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
  let body, eCls, i, len, ref, v;

  that.isVisible = true;
  that.opts = opts || that.opts;

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

  that.opts.autoFocusId = that.opts.autoFocusId || 'modalTitle';
  that.closeCls = that.opts.closeCls || that.closeCls;

  if (!that.opts.disableScrollTop) {
    win.scrollTo(0, 0);
  }

  that.elWrapper.style.display = that.elWrapper.style.visibility = '';
  that.elWrapper.className = that.trim((that.baseCls + ' ') + (that.opts.cls || ''));

  body = that.doc.getElementsByTagName('html')[ 0 ];
  eCls = body.className;
  body.className = that.trim(eCls + ' html-gmodal');

  setTimeout(() => {
    that.emit('show-timeout', that);
    that.el.className = that.trim((` ${ that.el.className } `).replace(' in ', '') + ' in');
  }, that.opts.timeout || 50);

  if (that.opts.hideOn) {
    that.opts._autoHideHandler = () => {
      return hideModalInternal(that);
    };

    ref = that.opts.hideOn.split(',');
    for (i = 0, len = ref.length; i < len; i++) {
      v = ref[ i ];
      if (v === 'esc' || v === 'click' || v === 'tap') {
        that.on(v, that.opts._autoHideHandler);
      }
    }
  }

  that.emit('show', that);
  return that;
}

function checkEvent(that, name, evt, el) {
  let myEvt, scls, tg;

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
        if (that.opts.autoFocusId) {
          const el = that.doc.getElementById(that.opts.autoFocusId);

          if (el && el.focus) {
            el.focus();
          }
        }

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
  let el = that.doc.getElementById('gmodal');

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
    };

    that.addEvent(el, 'click', (evt) => {
      return checkEvent(that, 'click', evt, el);
    });

    that.addEvent(el, 'keypress', (evt) => {
      return checkEvent(that, 'keypress', evt, el);
    });

    if (!that.doc.gmodalAttached) {
      that.addEvent(that.doc, 'keypress', (evt) => {
        return checkEvent(that, 'keypress', evt, el);
      });
      that.addEvent(that.doc, 'keydown', (evt) => {
        return checkEvent(that, 'keydown', evt, el);
      });
      that.doc.gmodalAttached = true;
    }

    that.addEvent(el, 'tap', (evt) => {
      return checkEvent(that, 'tap', evt, el);
    });

    el.appendChild(that.domify(that.tpl));
    that.doc.getElementsByTagName('body')[ 0 ].appendChild(el);
  }

  return el;
}

class GModal {
  constructor() {
    const that = this;

    that.win = window;
    that._name = 'gmodal';
    that.doc = this.win.document;
    that.ishim = null;
    that.elWrapper = null;
    that.el = null;
    that.opts = {};
    that.baseCls = 'gmodal';
    that.closeCls = 'gmodal-close';
    that.tpl = templateHtml;
    that.css = templateCss;
    that.domify = require('domify');
    that.emitter = emitter;
    that.isVisible = false;
  }

  get name() {
    return this._name;
  }

  /**
   * cross browser attach event
   * @param {object} obj     source object
   * @param {string} evtName event name
   * @param {object}         that
   */
  addEvent(obj, evtName, func) {
    if (obj.addEventListener) {
      obj.addEventListener(evtName, func, false);
    } else if (obj.attachEvent) {
      obj.attachEvent(evtName, func);
    } else if (this.getAttr(obj, 'on' + evtName)) {
      obj[ 'on' + evtName ] = func;
    } else {
      obj[ evtName ] = func;
    }
    return this;
  }

  /**
   * helper method to determine if an element has class
   * @param  {HTMLElement}  el
   * @param  {string}       cls class names
   * @return {Boolean}
   */
  hasCls(el, cls) {
    let i, k, len, ref, v;

    ref = cls.split(' ');
    for (k = i = 0, len = ref.length; i < len; k = ++i) {
      v = ref[ k ];
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
  injectStyle(id, css) {
    let el, elx, that = this;

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
      elx = that.doc.getElementsByTagName('link')[ 0 ];
      elx = elx || (that.doc.head || that.doc.getElementsByTagName('head')[ 0 ]).lastChild;
      elx.parentNode.insertBefore(el, elx);
    }

    return that;
  }

  /**
   * create an iframe
   * @return {object} the iframe
   */
  createiFrame(id, className) {
    let iframe = this.doc.createElement('iframe');

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
  loadiFrame(parentEl, html, id, className) {
    const iframe = this.createiFrame(id, className);

    parentEl[ 0 ].appendChild(iframe);

    /* jshint scripturl: true */
    if (iframe.contentWindow) {
      iframe.contentWindow.contents = html;
      iframe.src = 'javascript:window["contents"]';
    } else {
      const doc = iframe.contentDocument || iframe.document;

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
  trim(str) {
    return (str.trim) ? str.trim() : str.replace(/^\s*|\s*$/g, '');
  }

  /**
   * show or open modal
   * @param  {[Object}  opts   options
   * @param  {Function} hideCb callback function on hide
   * @return {Object}
   */
  show(opts, hideCb) {
    const that = this;
    const ref = that.doc;

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
  hide() {
    let that = this;

    if (!that.elWrapper) {
      return that;
    }

    if (that.opts) {
      hideModalInternal(that);
    }

    return that;
  }
}

emitter(GModal.prototype);

export default new GModal();
