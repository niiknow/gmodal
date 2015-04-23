Emitter = require('emitter')
domify = require('domify')
trim = require('trim')
win = window

modals = []

checkEvent = (self, name, evt, el) ->
    evt = evt || win.event
    tg = evt.target || evt.srcElement;
    if (tg.nodeType == 3)
        tg = tg.parentNode;

    if (self.hasCls(tg.parentNode, "#{self.closeCls}"))
      tg = tg.parentNode

    scls = "gmodal-wrap #{self.closeCls}"
    if (name is 'click')
      if (self.hasCls(tg, scls) or tg is el)
        self.emit('click', tg, evt)
    else if (name is 'keypress')
      if (self.hasCls(tg, scls) or tg is el or tg is sel.doc or tg is self.doc.body)
        if ((evt.which || evt.keyCode) is 27)
          self.emit('esc', tg, evt)
    else if (name is 'tap')
      if (self.hasCls(tg, scls) or tg is el)
        self.emit('tap', tg, evt)

    return false

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

###*
# modal
###
class modal
  doc: win.document
  elWrapper: null
  el: null
  opts: {}
  baseCls: 'gmodal'
  closeCls: 'gmodal-close'
  tpl: '<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>'
  css: '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling:touch;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:9999990}.body-gmodal .gmodal{display:table}.body-gmodal{overflow:hidden}.gmodal-content,.gmodal-wrap{display:table-cell;position:relative;vertical-align: middle}.gmodal-left,.gmodal-right{width:50%}'
  show: (opts, hideCb) ->
    self = @

    # must have document and body
    if (!self.doc or !self.doc.body)
      return false

    self.elWrapper = createModal(self)
    if (!self.el)
      self.el = self.doc.getElementById("gmodalContent")

    if (self.isVisible)
      return false

    if (opts)
      opts.hideCallback = hideCb
      modals.push(opts)
 
    if (modals.length > 0)
      opts = modals.shift()

    # empty opts mean to show previous content
    if (opts?)
      self.opts = opts

      # if new content, set it
      if (self.opts.content?)
        while self.el.firstChild
          self.el.removeChild self.el.firstChild

        if (typeof self.opts.content is 'string')
          self.el.appendChild domify(self.opts.content)
        else # must already be an element
          self.el.appendChild self.opts.content

        self.opts.content = null

    # return if previous opts is empty
    if (!self.opts)
      return false

    if (self.opts.closeCls)
      self.closeCls = self.opts.closeCls

    # make sure nothing interfer to the visibility of this element
    # then add class to display the element
    self.elWrapper.style.display = self.elWrapper.style.visibility = ""
    self.elWrapper.className = trim("#{self.baseCls} " + (self.opts.cls || ''))
    eCls = self.doc.getElementsByTagName('body')[0].className
    self.doc.getElementsByTagName('body')[0].className = trim("#{eCls} body-gmodal")
    self.isVisible = true
    self.emit('show', self)

    return self.isVisible

  hide: () ->
    self = @
    if (!self.elWrapper)
      return self
    self.elWrapper.className = "#{self.baseCls}"
    eCls = self.doc.getElementsByTagName('body')[0].className
    self.doc.getElementsByTagName('body')[0].className = trim(eCls.replace(/body\-gmodal/gi, ''))
    self.isVisible = false
    self.emit('hide', self)
    if (typeof self.opts.hideCallback is 'function')
      self.opts.hideCallback(self)
    @

  # inject style
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

    @

  # determine if it has class
  hasCls: (el, cls) ->
    for v, k in cls.split(' ')
      if (' ' + el.className).indexOf(' ' + v) >= 0
        return true
    return false

  

Emitter(modal.prototype)
gmodal = new modal()
win.gmodal = gmodal
module.exports = gmodal