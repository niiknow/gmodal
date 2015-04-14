((win) ->
  Emitter = require('emitter');
  $win = win;
  $doc = $win.document
  $baseCls = 'gmodal'
  $tpl = '<div class="gmodal-wrap gmodal-top">&nbsp;<div><div class="gmodal-wrap gmodal-left"></div><div class="gmodal-content" id="gmodalContent"></div><div class="gmodal-wrap gmodal-right"></div>'
  $css = '.gmodal{display:none;overflow:hidden;outline:0;-webkit-overflow-scrolling: touch;position:fixed;top:0;left:0;bottom:0;right:0;width:100%;height:100%;z-index:9999990}.gmodal-show{display:table}.gmodal-wrap,.gmodal-content{display:table-cell;width:33%}'

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
        if (hasCls(evt.target, 'gmodal-wrap gmodal-close') || evt.target == el)
          gmodal.emit('click', evt)
        return false

      myKeypress = (evt) ->
        evt = evt || $win.event
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, 'gmodal-wrap')|| evt.target == el || evt.target == $doc || evt.target == $doc.body)
          if ((evt.which || evt.keyCode) == 27)
            gmodal.emit('esc', evt)
        return false

      el.onkeypress = myKeypress
      $doc.onkeypress = myKeypress

      el.ontap = (evt) ->
        evt = evt || $win.event
        evt.target = evt.target || evt.srcElement;
        if (hasCls(evt.target, 'gmodal-wrap')|| evt.target == el)
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
     
      self.elWrapper.className = "#{$baseCls} gmodal-show " + (self.options.cls || '')
      self.emit('show')
      @

    hide: () ->
      self = @
      if (!self.elWrapper)
        return self

      self.elWrapper.className = "#{$baseCls}"
      self.emit('hide')


  Emitter(modal.prototype)
  result = new modal()
  win.gmodal = result
  module.exports = result
) window