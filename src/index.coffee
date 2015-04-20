Emitter = require('emitter')
$tpl = require('./template.html')
$css = require('./index.css')
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