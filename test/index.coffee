xstore = require('../src/index.coffee')
assert = require('component-assert')
jQuery = require('jquery')

describe 'gmodal.show', ->
  it 'should add body-gmodal on show and remove on hide', ->
    gmodal.show({content: 'hi'})
    visible = jQuery(document.body).hasClass('body-gmodal')
    assert visible, 'body should have .body-gmodal class'

    gmodal.hide()
    visible = jQuery(document.body).hasClass('body-gmodal')
    assert !visible, 'body should not have .body-gmodal class'

