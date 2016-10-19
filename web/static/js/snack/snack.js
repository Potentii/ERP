

/**
 * Module that manages the Snackbar
 * @namespace Snack
 */
const snack = (function(){
   let $snackbar;
   let $message;
   let $button;

   let curr_timer;
   let fade_animation_time = 250;

   // *Defining the queueing process:
   let queue = new AutoConsumableQueue((snack) => {
      // *Checking if one of snackbar html elements aren't set:
      if(!$snackbar || !$button || !$message){
         // *If they don't:
         // *Calling next snack:
         queue.next();
         return;
      }


      // *Setting the message text:
      $message.text(snack.message);

      // *Checking if both the button text and the action is set:
      if(snack.button_text && snack.action){
         // *If they are:
         // *Showing the button:
         $button.css('visibility', 'visible');
         // *Setting the button text:
         $button.text(snack.button_text);
         // *Setting the action:
         $button.one('click', snack.action);
         // *Setting the dismiss action:
         $button.one('click', e => {
            // *Dismissing the snackbar:
            dismiss();
         });
      } else{
         // *If they not:
         // *Hidding the button:
         $button.css('visibility', 'hidden');
      }

      // *Showing the snackbar:
      $snackbar.addClass('active');


      // *Starting the animation timer:
      curr_timer = setTimeout(() => {
         // *Starting the main timer:
         curr_timer = setTimeout(dismiss, snack.time);
      }, fade_animation_time);
   });



   /**
    * Dismisses the current Snackbar, if any
    * @author Guilherme Reginaldo Ruella
    */
   function dismiss(){
      // *Stopping the timer:
      clearTimeout(curr_timer);
      // *Hiding the snackbar:
      $snackbar.removeClass('active');
      // *Removing the action:
      $button.off('click');

      // *Start the dismiss animation time:
      curr_timer = setTimeout(() => {
         // *Erasing the message text:
         $message.text('');
         // *Erasing the button text:
         $button.text('');
         // *Calling next snack:
         queue.next();
      }, fade_animation_time);
   }



   /**
    * Displays a new message on Snackbar
    * @param  {string} message     The message to display
    * @param  {number} time        The duration
    * @param  {string} button_text The text inside the button
    * @param  {function} action    The button action
    * @author Guilherme Reginaldo Ruella
    */
   function open(message, time, button_text, action){
      // *Queueing up the snack:
      queue.add({
         message: message,
         time: time,
         button_text: button_text,
         action: action
      });
   }



   // *When page load:
   $(() => {
      // *Getting the elements references:
      $snackbar = $('#snackbar');
      $message = $('#snackbar > span');
      $button = $('#snackbar > button:nth-of-type(1)');

      // *When user clicks on dismiss button:
      $('#snackbar > button:nth-of-type(2)').on('click', e => {
         // *Dismissing this snakcbar:
         dismiss();
      });

      // *Setting up the fading animation duration:
      $snackbar.css('animation-duration', (fade_animation_time/1000) + 's');
   });



   // *Exporting the module:
   return {
      open: open,
      dismiss: dismiss,
      TIME_SHORT: 4000,
      TIME_LONG: 8000
   };
})();
