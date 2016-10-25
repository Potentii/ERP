

/**
 * Controls the navigation drawer
 * @namespace Drawer
 */
const drawer = (function(){
   const drawer_id = 'drawer';
   let $drawer;

   const drawer_overlay_id = 'drawer-overlay';
   let $drawer_overlay;

   const fade_animation_time = 200;

   const open_event = new HandledEvent();



   /**
    * Opens the navigation drawer
    * @author Guilherme Reginaldo Ruella
    */
   function open(){
      // *Checking if both the drawer and its overlay is set, returning if they aren't:
      if(!$drawer || !$drawer_overlay) return;

      // *Showing the drawer and its overlay, and playing the 'active' animation:
      $drawer_overlay.show().addClass('active');
      $drawer.show().addClass('active');

      // *Setting a timer for when the animation is over:
      setTimeout(() => {
         open_event.resolveAll(f => f());
      }, fade_animation_time);
   }



   /**
    * Dismisses the navigation drawer
    * @author Guilherme Reginaldo Ruella
    */
   function dismiss(){
      // *Checking if both the drawer and its overlay is set, returning if they aren't:
      if(!$drawer || !$drawer_overlay) return;

      // *Removing the 'active' class:
      $drawer.removeClass('active');
      $drawer_overlay.removeClass('active');

      // *Setting a timer for when the animation is over:
      setTimeout(() => {
         // *Hiding the drawer and its overlay:
         $drawer.hide();
         $drawer_overlay.hide();
      }, fade_animation_time);
   }



   /**
   * Defines an action to be executed when the drawer gets opened
   * @param {(function|function[])} action    The action to be done
   * @author Guilherme Reginaldo Ruella
   */
   function onOpen(action){
      // *Adding the action to the opening event handler:
      open_event.addListener(action);
   }



   // *When the page gets loaded:
   $(() => {
      // *Getting the elements references from the DOM:
      $drawer = $(`#${drawer_id}`);
      $drawer_overlay = $(`#${drawer_overlay_id}`);

      // *Setting up the drawer overlay:
      $drawer_overlay.css('animation-duration', (fade_animation_time/1000) + 's')
         .on('click', function(e){
            // *Checking if the user is clicking exactly at the overlay:
            if(this == e.target){
               // *If it is:
               // *Dismissing the navigation drawer:
               dismiss();
            }
         })
         .hide();

      // *Setting up the fading animation duration and hiding the drawer:
      $drawer.css('animation-duration', (fade_animation_time/1000) + 's')
         .hide();
   });



   // *Exporting the module:
   return {
      open: open,
      dismiss: dismiss,
      onOpen: onOpen
   };
})();
