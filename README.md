# gmodal
This project aim to create a cross-browser modal with overlay.  To keep things simple, we are defining that a modal is a singleton object; and therefore, a global object.

The initial requirement for this project.

1. Create a global variable for the modal.
2. Modal will center on the screen.
3. Modal will have its own overlay/backdrop that can prevent user interaction with the background.
4. People can bring their own css.
5. No bloated framework dependencies such as jQuery.
6. If a modal is visible, you must call hide before calling show.
7. cross-browser support including support of IE8.

## template
In order to attain cross-browser compatibility, gmodal template uses a grid system.  The template is:
```
body
  .gmodal
    .gmodal-container
      .gmodal-left .gmodal-content .gmodal-right
```
  
## css classes
* *.gmodal* - the primary overlay/wrapper
* *.gmodal-container* - make sure table display does not interfere with outside tables.
* *.gmodal-left* left collumn - allow for left padding - default 50%
* *.gmodal-content* middle collumn - content container - default vertical-align middle
* *.gmodal-right* right column - allow for right padding - default 50%
* *.gmodal-close* class can be use to tag element for close on click.  You can also use the gmodal.close method directly.
* *.body-gmodal* - apply to body whenever the gmodal is visible - default overflow hidden.

```
<button class="gmodal-close">x</button>
```

*.gmodal* itself, is an overlay.  You should provide your own overlay opacity.  Since the overlay is the actual modal, we do not recommend using opacity value.  Instead, we use a transparent pixel data URI, which you can generate using:  http://px64.net

```
    .gmodal {
        /* cross-browser IE8 and up compatible data URI RGBA(0,0,0,0.7) */
        background: url("data:image/gif;base64, iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNg2AQAALUAs0e+XlcAAAAASUVORK5CYII=");
    }

    .myModalContent {
        background: #fff;
        width: 500px;
        padding: 10px;
    }
```

And since you provide an opacity, you must undo the opacity on your content 
as seen in .yourModalContent example.  This is any class you give to
the wrapper of your modal content.  

You have full control over your modal content and CSS; therefore, you can provide your own CSS to support responsive UI.  Don't like to write your own css?  gmodal was designed with framework like Twitter-Bootstrap in mind.

We also have example of bootstrap modal css (no need to include bootstrap js, only css is sufficient): https://niiknow.github.io/gmodal/example/

## API

### gmodal#show(options, closeCb)
 Display the modal.  The options are:
 * content: string - the html content
 * cls: string - additional class to add to the gmodal div
closeCb - callback method on close, this is emitter#once('hide')

### gmodal#hide()
 Hide the modal.  Just call show again with empty option to show previous content.

### gmodal#iShimmy()
 for older IE (5-7), this allow you to shim the modal to prevent bleed through such as dropdown, flash, and other iframe.

Additionally, you cannot use data URI so you will have to use opacity filter.  You may want to keep these css separate with conditional include such as:
```
<!--[if lt IE 8]>
<style>
    .gmodal {
      background: #000; /* black - IE 5-7 */
      filter: alpha(opacity=75); /* IE 5-7 */
    }
    .myModalContent {
      background: #fff; /* white - IE 5-7 */
    }
</style>
<![endif]-->
```

### event mixin
*gmodal* uses event *emitter* component mixin here: https://github.com/component/emitter

The following are events emit from gmodal:
* on('tap', (evtname, evt)) - on tap of overlay area
* on('click', (evtname, evt)) - on click of overlay area
* on('esc', (evtname, evt)) - on esc key
* on('show', (evtname)) - on show modal
* on('hide', (evtname)) - on hide modal
* on('close', (evtname)) - on close element click

See https://github.com/component/emitter for documentation on trapping these events.

Lets say you want to hide modal based on any/all interaction with the overlay, you can wire up with all the events directly to the gmodal hide function:

```
gmodal.on('tap', gmodal.hide);
gmodal.on('click', gmodal.hide);
gmodal.on('esc', gmodal.hide);

// but the above example will execute on all modal
// alternatively, you can use the method below to
// only hide on particular modal content
gmodal.show({content: 'hide on all events', hideOn: 'click,esc,tap'});
gmodal.show({content: 'hide on esc', hideOn: 'esc'});
```

You can also emit your own event and have code listen to it.

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
window.gmodal.show({ content: 'html here', 
  cls: 'additional classes for elWrapper', 
  hideOn: 'click, esc,tap'});
```
