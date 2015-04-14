# gmodal
There can be only one.  This project aim to create a cross-browser modal with overlay. 
To keep things simple, we are defining that a modal is a singleton object; and therefore, it would be a global object.

The initial requirement for this project.

1. Create a global variable for the modal.
2. Modal will center on the screen.
3. Modal will have its own overlay/backdrop that can prevent user interaction with the background.
4. People can bring their own css.

# template
In order to attain cross-browser compatibility, gmodal template uses a grid system.  The
template is as followed:
```coffee
gmodal
  gmodal-top (1st row - allow you to add 'padding-top' css separate from content)
  gmodal-left (2nd row - left collumn - allow for left padding - default 33%)
  gmodal-content (2nd row - middle collumn - content container - default 33%)
    your-own-content-goes-here
  gmodal-right (2nd row - right column - allow for right padding - default 33%)
```

## css


## API

### gmodal#show(options)
 Display the modal.  The options are:
 * content: string - the html content
 * cls: string - additional class to add to the gmodal div

### gmodal#hide()

```
window.gmodal.elWrapper;  // the overlay element
window.gmodal.el;  // the element that contain content
window.gmodal.show({content: 'html here', cls: 'additional classes'});
window.gmodal.hide();
window.gmodal.on(eventName); // listen to even on overlay or modal
```
