Emitter = require('emitter')
$tpl = '<div class="gmodal-wrap gmodal-top">&nbsp;<div>\n<div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>'
$css = '.gmodal {\n    display: none;\n    overflow: hidden;\n    outline: 0;\n    -webkit-overflow-scrolling: touch;\n    position: fixed;\n    top: 0;\n    left: 0;\n    bottom: 0;\n    right: 0;\n    width: 100%;\n    height: 100%;\n    z-index: 9999990;  /* based on safari 16777271 */ \n}\n.gmodal-show { display: table }\n.gmodal-wrap,\n.gmodal-content {\n    display: table-cell;\n    width: 33%;\n}'
$win = window;
$doc = $win.document
$baseCls = 'gmodal'
$closeCls = 'gmodal-close'

injectStyle = (id, data) ->
  el = $doc.getElementById(id)
  if (!el)
    el = $doc.createElement('style')
    el.type = 'text/css'
    el.appendChild $doc.createTextNode(data)
    ($doc.head or $doc.getElementsByTagName('head')[0]).appendChild el

hasCls = (el, cls) ->
  for v, k in cls.split(' ')
    if (' ' + el.className).indexOf(' ' + v) >= 0
      return true
  return false

createModal = () ->
  el = $doc.getElementById("gmodal")
  if (!el) 
    injectStyle('gmodal-css', $css)
    el = $doc.createElement('div');
    el.id = 'gmodal'
    el.onclick = (evt) ->
      evt = evt || $win.event
      evt.target = evt.target || evt.srcElement;
      if (hasCls(evt.target, "gmodal-wrap #{$closeCls}") || evt.target == el)
        gmodal.emit('click', evt)
      return false

    myKeypress = (evt) ->
      evt = evt || $win.event
      evt.target = evt.target || evt.srcElement;
      if (hasCls(evt.target, "gmodal-wrap")|| evt.target == el || evt.target == $doc || evt.target == $doc.body)
        if ((evt.which || evt.keyCode) == 27)
          gmodal.emit('esc', evt)
      return false

    el.onkeypress = myKeypress
    $doc.onkeypress = myKeypress

    el.ontap = (evt) ->
      evt = evt || $win.event
      evt.target = evt.target || evt.srcElement;
      if (hasCls(evt.target, "gmodal-wrap #{$closeCls}")|| evt.target == el)
        gmodal.emit('tap', evt)
      return false

    el.innerHTML = $tpl
    $doc.getElementsByTagName('body')[0].appendChild(el)

  return el

###*
# modal
###
class modal
  elWrapper: null
  el: null
  options: {}
  show: (options) ->
    self = this
    self.elWrapper = createModal()
    if (!self.el)
      self.el = $doc.getElementById("gmodalContent")    

    # empty options mean to show previous content
    if (options?)
      self.options = options

      # if new content, set it
      if (self.options.content?)
        self.el.innerHTML = self.options.content
        self.options.content = null

    # return if previous options is empty
    if (!self.options)
      return self

    if (self.options.closeCls)
      $closeCls = self.options.closeCls
   
    # make sure nothing interfer to the visibility of this element
    # then add class to display the element
    self.elWrapper.style.display = self.elWrapper.style.visibility = ""
    self.elWrapper.className = "#{$baseCls} gmodal-show " + (self.options.cls || '')
    self.emit('show')
    @

  hide: () ->
    self = @
    if (!self.elWrapper)
      return self

    self.elWrapper.className = "#{$baseCls}"
    self.emit('hide')
    @

  # inject style
  injectStyle: injectStyle

  # determine if it has class
  hasCls: hasCls

Emitter(modal.prototype)
result = new modal()
$win.gmodal = result
module.exports = result