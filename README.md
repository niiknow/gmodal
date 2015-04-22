# gmodal
There can be only one.  This project aim to create a cross-browser modal with overlay. 
To keep things simple, we are defining that a modal is a singleton object; and therefore, it would be a global object.

The initial requirement for this project.

1. Create a global variable for the modal.
2. Modal will center on the screen.
3. Modal will have its own overlay/backdrop that can prevent user interaction with the background.
4. People can bring their own css.
5. No bloated framework dependencies such as jQuery.

## template
In order to attain cross-browser compatibility, gmodal template uses a grid system.  The
template is as followed:
```
gmodal
  gmodal-left gmodal-content gmodal-right
```
  
## css classes
* *gmodal* - the primary overlay/wrapper - default padding-top of 50px
* *gmodal-left* (2nd row - left collumn - allow for left padding - default 50%)
* *gmodal-content* (2nd row - middle collumn - content container)
* *gmodal-right* (2nd row - right column - allow for right padding - default 50%)
* *gmodal-close* class can be use to tag element for close on click.  You can also use the gmodal.close method directly.
```
<button class="gmodal-close">x</button>
```

*gmodal* itself, is an overlay.  You can provide your own overlay opacity:
```
.gmodal {
		filter: alpha(opacity=75); /* IE8 */
		background: #000; /* IE8 */
	}

.yourModalContentClass {
		filter: alpha(opacity=1); /* IE8 */
		background: #fff; /* IE8 */
	}
```
And since you provide an opacity, you must undo the opacity on your content 
as seen in .yourModalContentClass example.  This is any class you give to
the wrapper of your modal content.  

As you can see, you have full control over your modal content and CSS.  Therefore,
you can provide your own CSS to support responsive UI.  When providing your own css,
remember to take into account for the gmodal classes such as: gmodal-left,
and gmodal-right.  Add padding-top to your .gmodal class to vertically asign your modal.

With the flexbility, you can have modal content as any valid html content including
iframe and spinner gif. 

Don't like to write your own css?  gmodal was designed with framework like bootstrap in mind.  
We also provide examples of gmodal integration with bootstrap modal css.  You do not
need to have bootstrap modal javascript.

## API

### gmodal#show(options)
 Display the modal.  The options are:
 * content: string - the html content
 * cls: string - additional class to add to the gmodal div

### gmodal#hide()
 Hide the modal.  Just call show again with empty option to show previous content.

### Emitter mixin
*gmodal* uses event *emitter* component mixin here: https://github.com/component/emitter

The following are events emit from gmodal:
* on('tap', (evtname, evt)) - on tap of overlay area
* on('click', (evtname, evt)) - on click of overlay area
* on('esc', (evtname, evt)) - on esc key
* on('show', (evtname)) - on show modal
* on('hide', (evtname)) - on hide modal

See https://github.com/component/emitter for documentation on trapping these events.

Lets say you want to hide modal based on any/all interaction with the overlay, you can 
wire up with all the events directly to the gmodal hide function:

```
gmodal.on('tap', gmodal.hide)
gmodal.on('click', gmodal.hide)
gmodal.on('esc', gmodal.hide)
```

You can also emit your own modal event and have code listen to it.

```
gmodal.emit('save-click', objToSave)
gmodal.on('save-click', function(objToSave) {
	// do something with objToSave
});
```

### other examples
```
window.gmodal.elWrapper;  // the overlay element
window.gmodal.el;         // the element that contain content
window.gmodal.show({content: 'html here', cls: 'additional classes'});
window.gmodal.hide();
```
