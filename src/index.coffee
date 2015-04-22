Emitter = require('emitter')
domify = require('domify')
win = window

###*
# modal
###
class modal
  doc: win.document
  elWrapper: null
  el: null
  options: {}
  baseCls: 'gmodal'
  closeCls: 'gmodal-close'
  tpl: '<div class="gmodal-wrap gmodal-top">&nbsp;<div><div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>'
  css: '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling:touch;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:9999990}.gmodal-show{display:table}.gmodal-content,.gmodal-wrap{display:table-cell}.gmodal-wrap{width:50%}'
  show: (options) ->
    self = @
    self.elWrapper = self.createModal()
    if (!self.el)
      self.el = self.doc.getElementById("gmodalContent")    

    # empty options mean to show previous content
    if (options?)
      self.options = options

      # if new content, set it
      if (self.options.content?)
        while self.el.firstChild
          self.el.removeChild self.el.firstChild

        if (typeof self.options.content is 'string')
          self.el.appendChild domify(self.options.content)
        else # must already be an element
          self.el.appendChild self.options.content

        self.options.content = null

    # return if previous options is empty
    if (!self.options)
      return self

    if (self.options.closeCls)
      self.closeCls = self.options.closeCls
   
    # make sure nothing interfer to the visibility of this element
    # then add class to display the element
    self.elWrapper.style.display = self.elWrapper.style.visibility = ""
    self.elWrapper.className = "#{self.baseCls} gmodal-show " + (self.options.cls || '')
    self.emit('show')
    @

  hide: () ->
    self = @
    if (!self.elWrapper)
      return self

    self.elWrapper.className = "#{self.baseCls}"
    self.emit('hide')
    @

  # inject style
  injectStyle: (id, data) ->
    self = @
    el = self.doc.getElementById(id)
    if (!el)
      el = self.doc.createElement('style')
      el.id = id
      el.type = 'text/css'
      if (el.styleSheet)
        el.styleSheet.cssText = data;
      else
        el.appendChild self.doc.createTextNode(data)
      (self.doc.head or self.doc.getElementsByTagName('head')[0]).appendChild el

    @

  # determine if it has class
  hasCls: (el, cls) ->
    for v, k in cls.split(' ')
      if (' ' + el.className).indexOf(' ' + v) >= 0
        return true
    return false

  checkEvent: (name, evt, el) ->
    self = @
    evt = evt || win.event
    tg = evt.target || evt.srcElement;
    if (tg.nodeType == 3) 
        tg = tg.parentNode;

    if (self.hasCls(tg.parentNode, "#{self.closeCls}"))
      tg = tg.parentNode

    scls = "gmodal-wrap #{self.closeCls}"
    if (name is 'click')
      if (self.hasCls(tg, scls) or tg is el)
        self.emit('click', evt)
    else if (name is 'keypress')
      if (self.hasCls(tg, scls) or tg is el or tg is sel.doc or tg is self.doc.body)
        if ((evt.which || evt.keyCode) is 27)
          self.emit('esc', evt)
    else if (name is 'tap')
      if (self.hasCls(tg, scls) or tg is el)
        self.emit('tap', evt)

    return false

  createModal: () ->
    self = @
    el = self.doc.getElementById("gmodal")
    if (!el) 
      self.injectStyle('gmodal-css', self.css)
      el = self.doc.createElement('div');
      el.id = 'gmodal'
      el.onclick = (evt) ->
        return self.checkEvent('click', evt, el)

      myKeypress = (evt) ->
        return self.checkEvent('keypress', evt, el)

      el.onkeypress = myKeypress
      if (typeof self.doc.onkeypress is 'function')
        oldkp = self.doc.onkeypress
        self.doc.onkeypress = (evt) ->
          oldkp(evt)
          return myKeypress(evt)
      else
        self.doc.onkeypress = myKeypress

      el.ontap = (evt) ->
        return self.checkEvent('tap', evt, el)

      el.appendChild domify(self.tpl)
      self.doc.getElementsByTagName('body')[0].appendChild(el)

    return el

Emitter(modal.prototype)
gmodal = new modal()
win.gmodal = gmodal
module.exports = gmodal