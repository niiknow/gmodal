const emitter = require( 'component-emitter' );

const templateHtml = require( 'template.html' );
const templateCss = require( 'template.css' );
const win = window;

let modals = [];

function hideModalInternal( self ) {
  self.elWrapper.className = '' + self.baseCls;
  self.el.className = 'gmodal-wrap gmodal-content';
  setTimeout( () => {
    let eCls = self.doc.getElementsByTagName( 'html' )[ 0 ].className;

    self.doc.getElementsByTagName( 'html' )[ 0 ].className = self.trim( eCls.replace( /html\-gmodal/gi, '' ) );
    self.isVisible = false;
    self.emit( 'hide', self );

    if ( typeof self.opts.hideCallback === 'function' ) {
      self.opts.hideCallback( self );
    }

    if ( self.opts._autoHideHandler ) {
      self.off( 'esc', self.opts._autoHideHandler );
      self.off( 'click', self.opts._autoHideHandler );
      self.off( 'tap', self.opts._autoHideHandler );
    }

    if ( modals.length !== 0 ) {
      return self.show();
    }

    return self;
  }, self.opts.timeout || 50 );

  return self;
}

function showModalInternal( self, opts ) {
  let body, eCls, i, len, ref, v;

  self.isVisible = true;

  if ( opts ) {
    self.opts = opts;
    if ( self.opts.content ) {
      while ( self.el.firstChild ) {
        self.el.removeChild( self.el.firstChild );
      }

      if ( typeof self.opts.content === 'string' ) {
        if ( self.opts.content.indexOf( '<!DOCTYPE' ) > -1 || self.opts.iframe ) {
          self.loadiFrame( self.el, self.opts.content, null, 'gmodal-iframe' );
        } else {
          self.el.appendChild( self.domify( self.opts.content ) );
        }
      } else {
        self.el.appendChild( self.opts.content );
      }

      self.opts.content = null;
    }
  }

  self.closeCls = self.opts.closeCls || self.closeCls;
  if ( !self.opts.disableScrollTop ) {
    win.scrollTo( 0, 0 );
  }

  self.elWrapper.style.display = self.elWrapper.style.visibility = '';
  self.elWrapper.className = self.trim( ( self.baseCls + ' ' ) + ( self.opts.cls || '' ) );

  body = self.doc.getElementsByTagName( 'html' )[ 0 ];
  eCls = body.className;
  body.className = self.trim( eCls + ' html-gmodal' );

  setTimeout( () => {
    self.emit( 'show-timeout', self );
    self.el.className = self.trim( ( ' ' + self.el.className + ' ' ).replace( ' in ', '' ) + ' in' );
  }, self.opts.timeout || 50 );

  if ( self.opts.hideOn ) {
    self.opts._autoHideHandler = () => {
      return hideModalInternal( self );
    };
    ref = self.opts.hideOn.split( ',' );
    for ( i = 0, len = ref.length; i < len; i++ ) {
      v = ref[ i ];
      if ( v === 'esc' || v === 'click' || v === 'tap' ) {
        self.on( v, self.opts._autoHideHandler );
      }
    }
  }

  self.emit( 'show', self );
  return self;
}

function checkEvent( self, name, evt, el ) {
  var myEvt, scls, tg;

  evt = evt || win.event;
  tg = evt.target || evt.srcElement;
  if ( tg.nodeType === 3 ) {
    tg = tg.parentNode;
  }
  if ( self.hasCls( tg.parentNode, '' + self.closeCls ) ) {
    tg = tg.parentNode;
  }
  scls = 'gmodal-container gmodal-wrap';
  if ( name === 'click' ) {
    if ( self.hasCls( tg, scls ) || tg === el ) {
      self.emit( 'click', tg, evt );
    }
  } else if ( name === 'keypress' ) {
    if ( self.hasCls( tg, scls ) || tg === el || tg === self.doc || tg === self.doc.body ) {
      if ( ( evt.which || evt.keyCode ) === 27 ) {
        self.emit( 'esc', tg, evt );
      }
    }
  } else if ( name === 'tap' ) {
    if ( self.hasCls( tg, scls ) || tg === el ) {
      self.emit( 'tap', tg, evt );
    }
  }
  if ( self.hasCls( tg, '' + self.closeCls ) ) {
    myEvt = {
      cancel: false
    };
    self.emit( 'close', myEvt, tg, evt );
    if ( !myEvt.cancel ) {
      hideModalInternal( self );
    }
  }
  return true;
}

function createModal( self ) {
  var el = self.doc.getElementById( 'gmodal' );

  if ( !el ) {
    self.injectStyle( 'gmodalcss', self.css );
    el = self.doc.createElement( 'div' );
    el.id = 'gmodal';

    self.addEvent( el, 'click', ( evt ) => {
      return checkEvent( self, 'click', evt, el );
    } );

    self.addEvent( el, 'keypress', ( evt ) => {
      return checkEvent( self, 'keypress', evt, el );
    } );

    if ( !self.doc.gmodalAttached ) {
      self.addEvent( self.doc, 'keypress', ( evt ) => {
        return checkEvent( self, 'keypress', evt, el );
      } );
      self.doc.gmodalAttached = true;
    }

    self.addEvent( el, 'tap', ( evt ) => {
      return checkEvent( self, 'tap', evt, el );
    } );

    el.appendChild( self.domify( self.tpl ) );
    self.doc.getElementsByTagName( 'body' )[ 0 ].appendChild( el );
  }

  return el;
}

class GModal {
  constructor() {
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
    this.domify = require( 'domify' );
    this.emitter = emitter;
  }

  get name() {
    return this._name;
  }

  /**
   * cross browser attach event
   * @param {object} obj     source object
   * @param {string} evtName event name
   * @param {object}         self
   */
  addEvent( obj, evtName, func ) {
    if ( obj.addEventListener ) {
      obj.addEventListener( evtName, func, false );
    } else if ( obj.attachEvent ) {
      obj.attachEvent( evtName, func );
    } else if ( this.getAttr( obj, 'on' + evtName ) ) {
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
  hasCls( el, cls ) {
    let i, k, len, ref, v;

    ref = cls.split( ' ' );
    for ( k = i = 0, len = ref.length; i < len; k = ++i ) {
      v = ref[ k ];
      if ( ( ' ' + el.className + ' ' ).indexOf( ' ' + v + ' ' ) >= 0 ) {
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
  injectStyle( id, css ) {
    let el, elx, self = this;

    el = self.doc.getElementById( id );

    if ( !el ) {
      el = self.doc.createElement( 'style' );
      el.id = id;
      el.type = 'text/css';
      if ( el.styleSheet ) {
        el.styleSheet.cssText = css;
      } else {
        el.appendChild( self.doc.createTextNode( css ) );
      }
      elx = self.doc.getElementsByTagName( 'link' )[ 0 ];
      elx = elx || ( self.doc.head || self.doc.getElementsByTagName( 'head' )[ 0 ] ).lastChild;
      elx.parentNode.insertBefore( el, elx );
    }

    return self;
  }

  /**
   * create an iframe
   * @return {object} the iframe
   */
  createiFrame( id, className ) {
    let iframe = this.doc.createElement( 'iframe' );

    if ( id ) iframe.id = id;
    if ( className ) iframe.className = className;

    iframe.frameBorder = '0';
    iframe.marginWidth = '0';
    iframe.marginHeight = '0';
    iframe.setAttribute( 'border', '0' );
    iframe.setAttribute( 'allowtransparency', 'true' );
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
  loadiFrame( parentEl, html, id, className ) {
    let iframe = this.createiFrame( id, className );

    parentEl[ 0 ].appendChild( iframe );

    /* jshint scripturl: true */
    if ( iframe.contentWindow ) {
      iframe.contentWindow.contents = html;
      iframe.src = 'javascript:window["contents"]';
    } else {
      let doc = iframe.contentDocument || iframe.document;

      doc.open();
      doc.write( html );
      doc.close();
    }

    return iframe;
  } // loadiFrame

  /**
   * trim string
   * @param  {string} str the string
   * @return {string}     trimmed result
   */
  trim( str ) {
    return ( str.trim ) ? str.trim() : str.replace( /^\s*|\s*$/g, '' );
  }

  /**
   * show or open modal
   * @param  {[Object}  opts   options
   * @param  {Function} hideCb callback function on hide
   * @return {Object}
   */
  show( opts, hideCb ) {
    let ref, self = this;

    if ( !( ( ref = self.doc ) ? ref.body : void 0 ) ) {
      return false;
    }

    self.elWrapper = createModal( self );
    if ( !self.el ) {
      self.el = self.doc.getElementById( 'gmodalContent' );
    }

    if ( opts ) {
      opts.hideCallback = hideCb;
      modals.push( opts );
    }

    if ( self.isVisible ) {
      return false;
    }

    if ( modals.length > 0 ) {
      opts = modals.shift();
    }

    if ( !opts ) {
      return false;
    }

    showModalInternal( self, opts );
    return self;
  }

  /**
   * hide or close modal
   * @return {Object}
   */
  hide() {
    let self = this;

    if ( !self.elWrapper ) {
      return self;
    }

    if ( self.opts ) {
      hideModalInternal( self );
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

    if ( self.elWrapper && !self.shim ) {
      self.ishim = self.doc.createElement( 'iframe' );
      self.ishim.className = 'gmodal-iframeshim';
      self.ishim.frameBorder = '0';
      self.ishim.marginWidth = '0';
      self.ishim.marginHeight = '0';
      self.ishim.scrolling = 'no';
      self.ishim.setAttribute( 'border', '0' );
      self.ishim.height = '100%';
      self.ishim.width = '100%';
      self.elWrapper.appendChild( self.ishim );
    }
    return self;
  }
}

let gmodal = new GModal();

if ( !gmodal.win.gmodal ) {
  emitter( GModal.prototype );
  gmodal.win.gmodal = new GModal();
}

module.exports = gmodal.win.gmodal;
