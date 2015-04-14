# gmodal
There can be only one.  This project aim to create a cross-browser modal with overlay. To keep it simple, there should only be one modal; and therefore, gmodal will be a global object.

# spec
1. Create a global variable for the modal.
2. Modal will center on the screen.
3. Modal will have its own overlay/backdrop that can prevent user interaction with the background.
4. On interaction with overlay, classes are added.  Possible classes are ('click, esc, tap')
5. Addtional classes can be added to the modal.

# css
Provided CSS are built into the modal script.  Since it is a global modal, the modal id is also the same as the classname.  This make it possible to override with your own CSS such as setting overlay transparency.

```
window.gmodal.elWrapper;  // the overlay element
window.gmodal.el;  // the element that contain content
window.gmodal.show({content: 'html here', cls: 'additiona classes'});
window.gmodal.hide();
window.gmodal.on(eventName); // listen to even on overlay or modal
```
