Emitter = require('emitter')
domify = require('domify')
trim = require('trim')
win = window.self or window
gmodal = win.gmodal

# hold modals queue
modals = []

checkEvent = (self, name, evt, el) ->
    evt = evt or win.event
    tg = evt.target or evt.srcElement;
    if (tg.nodeType is 3)
        tg = tg.parentNode;

    if (self.hasCls(tg.parentNode, "#{self.closeCls}"))
      tg = tg.parentNode

    scls = "gmodal-container gmodal-wrap"
    if (name is 'click')
      if (self.hasCls(tg, scls) or tg is el)
        self.emit('click', tg, evt)
    else if (name is 'keypress')
      if (self.hasCls(tg, scls) or tg is el or tg is self.doc or tg is self.doc.body)
        if ((evt.which or evt.keyCode) is 27)
          self.emit('esc', tg, evt)
    else if (name is 'tap')
      if (self.hasCls(tg, scls) or tg is el)
        self.emit('tap', tg, evt)

    if (self.hasCls(tg, "#{self.closeCls}"))
      myEvt = { cancel: false }
      self.emit('close', myEvt, tg, evt)
      hideModalInternal(self) unless myEvt.cancel

    # just intercept event, not handle so allow propagation
    return true

createModal = (self) ->
    el = self.doc.getElementById("gmodal")
    if (!el)
      self.injectStyle('gmodalcss', self.css)
      el = self.doc.createElement('div');
      el.id = 'gmodal'
      el.onclick = (evt) ->
        return checkEvent(self, 'click', evt, el)

      myKeypress = (evt) ->
        return checkEvent(self, 'keypress', evt, el)

      el.onkeypress = myKeypress
      if (typeof self.doc.onkeypress is 'function')
        oldkp = self.doc.onkeypress
        self.doc.onkeypress = (evt) ->
          oldkp(evt)
          return myKeypress(evt)
      else
        self.doc.onkeypress = myKeypress

      el.ontap = (evt) ->
        return checkEvent(self, 'tap', evt, el)

      el.appendChild domify(self.tpl)
      self.doc.getElementsByTagName('body')[0].appendChild(el)

    return el

createiFrame = (parentEl, content) ->
  iframe = win.document.createElement('iframe')
  iframe.className = 'gmodal-iframe'
  iframe.frameBorder = '0'
  iframe.marginWidth = '0'
  iframe.marginHeight = '0'
  iframe.setAttribute('border', '0')
  iframe.setAttribute('allowtransparency', 'true')
  iframe.width = '100%'
  iframe.height = '100%'
  parentEl.appendChild(iframe)

  if (iframe.contentWindow)
    iframe.contentWindow.contents = content
    iframe.src = 'javascript:window["contents"]'
    return iframe

  doc = iframe.contentDocument or iframe.document

  doc.open()
  doc.write(content)
  doc.close()
  return iframe

showModalInternal = (self, opts) ->
  self.isVisible = true
  # empty opts mean to show previous content
  if (opts?)
    self.opts = opts

    # if new content, set it
    if (self.opts.content?)
      # clear existing content
      while self.el.firstChild
        self.el.removeChild self.el.firstChild

      if (typeof self.opts.content is 'string')
        if (self.opts.content.indexOf('<!DOCTYPE') > -1 or self.opts.iframe)
          # create iframe
          createiFrame(self.el, self.opts.content)
        else
          self.el.appendChild domify(self.opts.content)

      else # must already be an element
        self.el.appendChild self.opts.content

      self.opts.content = null

  # set custom close class
  self.closeCls = self.opts.closeCls or self.closeCls

  # scroll to top before opening modal
  if (!self.opts.disableScrollTop)
    win.scrollTo 0, 0

  # make sure nothing interfere to the visibility of this element
  self.elWrapper.style.display = self.elWrapper.style.visibility = ""

  # then add class to display the element
  self.elWrapper.className = trim("#{self.baseCls} " + (self.opts.cls or ''))

  # add to html element
  body = self.doc.getElementsByTagName('html')[0]
  eCls = body.className
  body.className = trim("#{eCls} html-gmodal")

  setTimeout ->
    self.emit('show-timeout', self)
    self.el.className = trim(" #{self.el.className} ".replace(' in ', '') + ' in')
    return
  , self.opts.timeout or 50

  if (self.opts.hideOn)
    self.opts._autoHideHandler = ->
      hideModalInternal(self)

    for v in self.opts.hideOn.split(',')
      if (v is 'esc' or v is 'click' or v is 'tap')
        self.on(v, self.opts._autoHideHandler)

  # notify on show
  self.emit('show', self)
  return self

hideModalInternal = (self) ->
  # reset wrapper class
  self.elWrapper.className = "#{self.baseCls}"
  self.el.className = 'gmodal-wrap gmodal-content'

  setTimeout ->
    # remove body-gmodal class from body
    eCls = self.doc.getElementsByTagName('html')[0].className
    self.doc.getElementsByTagName('html')[0].className = trim(eCls.replace(/html\-gmodal/gi, ''))

    # emit modal hide
    self.isVisible = false
    self.emit('hide', self)

    # trigger custom callback
    if (typeof self.opts.hideCallback is 'function')
      self.opts.hideCallback(self)

    if (self.opts._autoHideHandler)
      self.off('esc', self.opts._autoHideHandler)
      self.off('click', self.opts._autoHideHandler)
      self.off('tap', self.opts._autoHideHandler)

    # if there are more modals to show, show next modal
    self.show() unless modals.length is 0

  , self.opts.timeout or 50

  return self

###*
# modal
###
class modal
  doc: win.document
  ishim: null
  elWrapper: null
  el: null
  opts: {}
  baseCls: 'gmodal'
  closeCls: 'gmodal-close'
  tpl: '<div class="gmodal-container"><div class="gmodal-wrap gmodal-left"></div><div class="gmodal-wrap gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div></div>'
  css: '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling:touch;position:fixed;top:0;left:0;width:100%;height:200%;z-index:9999990}.gmodal .frameshim{position:absolute;display:block;visibility:hidden;width:100%;height:100%;margin:0;top:0;left:0;border:none;z-index:-999}.html-gmodal body .gmodal{display:block}.html-gmodal,.html-modal body{overflow:hidden;margin:0;padding:0;height:100%;width:100%}.gmodal-container{display:table;position:relative;width:100%;height:50%}.gmodal-wrap{display:table-cell;position:relative;vertical-align:middle}.gmodal-left,.gmodal-right{width:50%}'

  ###*
   * show or open modal
   * @param  {[Object}  opts   options
   * @param  {Function} hideCb callback function on hide
   * @return {Object}
  ###
  show: (opts, hideCb) ->
    self = @

    # must have document and body
    return false unless self.doc?.body

    self.elWrapper = createModal(self)
    if (!self.el)
      self.el = self.doc.getElementById("gmodalContent")

    if (opts)
      opts.hideCallback = hideCb
      modals.push(opts)

    return false unless !self.isVisible

    if (modals.length > 0)
      opts = modals.shift()

    # return if previous opts is empty
    return false unless opts

    showModalInternal self, opts

    return self

  ###*
   * hide or close modal
   * @return {Object}
  ###
  hide: () ->
    self = @
    return self unless self.elWrapper
    hideModalInternal(self) unless !self.opts
    return self

  ###*
   * Helper method to inject your own css
   * @param  {string} id  css id
   * @param  {string} css the css text
   * @return {Object}
  ###
  injectStyle: (id, css) ->
    self = @
    el = self.doc.getElementById(id)
    if (!el)
      el = self.doc.createElement('style')
      el.id = id
      el.type = 'text/css'
      if (el.styleSheet)
        el.styleSheet.cssText = css
      else
        el.appendChild self.doc.createTextNode(css)
      elx = self.doc.getElementsByTagName('link')[0]
      elx = elx or (self.doc.head or self.doc.getElementsByTagName('head')[0]).lastChild
      elx.parentNode.insertBefore el, elx
    return self

  ###*
   * helper method to determine if an element has class
   * @param  {HTMLElement}  el
   * @param  {string}       cls class names
   * @return {Boolean}
  ###
  hasCls: (el, cls) ->
    for v, k in cls.split(' ')
      if (' ' + el.className + ' ').indexOf(' ' + v + ' ') >= 0
        return true
    return false

  ###*
   * append an iframe shim for older IE
   * WARNING: this is only for stupid older IE bug
   * do not use with modern browser or site with ssl
   * @return {Object}
  ###
  iShimmy: () ->
    self = @
    if self.elWrapper? and !self.shim
      self.ishim = self.doc.createElement('iframe');
      self.ishim.className = 'gmodal-iframeshim'
      self.ishim.frameBorder = '0'
      self.ishim.marginWidth = '0'
      self.ishim.marginHeight = '0'
      self.ishim.scrolling = 'no'
      self.ishim.setAttribute('border', '0')
      self.ishim.height = '100%'
      self.ishim.width = '100%'
      self.elWrapper.appendChild self.ishim
    return self

if (!gmodal)
  Emitter(modal.prototype)
  gmodal = new modal()
  win.gmodal = gmodal

module.exports = gmodal
