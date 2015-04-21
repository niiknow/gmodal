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
  tpl: '<div class="gmodal-wrap gmodal-top">&nbsp;<div>\n<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>'
  css: '.gmodal {\n    display: none;\n    overflow: hidden;\n    outline: 0;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 9999990;  /* based on safari 16777271 */ \n}\n.gmodal-show { display: table }\n.gmodal-wrap,\n.gmodal-content {\n    display: table-cell;\n    width: 33%;\n}'
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

        self.el.appendChild domify(self.options.content)
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
        tg = evt.target.parentNode;

    if (self.hasCls(evt.target.parentNode, "#{self.closeCls}"))
      tg = evt.target.parentNode

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