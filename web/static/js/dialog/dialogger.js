

/**
 * Provides access to dialog system
 * @namespace Dialogger
 */
const dialogger = (function(){
   let dialogs = [];
   let current_dialog = undefined;

   let overlay_id = '';
   let $overlay = undefined;

   const fade_animation_time = 200;

   const DIALOG_STATUS_NEGATIVE = 1;
   const DIALOG_STATUS_NEUTRAL = 2;
   const DIALOG_STATUS_POSITIVE = 3;

   // *Defining the dialog queue consumer:
   const queue = new AutoConsumableQueue(({dialog_name, params, onQuickDismiss}) => {
      // *Checking if the given dialog exists:
      if(!dialogExists(dialog_name)){
         // *If it doesn't:
         // *Calling the next one:
         queue.next();
         return;
      }

      // *Getting the dialog object:
      let dialog = findDialog(dialog_name);

      // *Setting the current dialog flag:
      current_dialog = dialog;

      // *Setting the quick dismiss action:
      dialog.setOnQuickDismiss(onQuickDismiss);

      // *Showing the overlay element and setting it as active:
      getOverlay().show().addClass('active');
      // *Showing the dialog element and setting it as active:
      dialog.getDOM().show().addClass('active');

      // *Calling all the opening event listeners:
      dialog.getOnOpen().resolveAll(f => f(dialog, params));
   });



   /**
    * Subscribes a new dialog to the dialogger system
    * @param  {Dialog} dialog The dialog to subscribe
    * @author Guilherme Reginaldo Ruella
    */
   function subscribe(dialog){
      // *If dialog argument isn't a Dialog, return:
      if(!(dialog instanceof Dialog)) return;

      // *If already exists a dialog with same name, return:
      if(dialogExists(dialog.getName())) return;

      // *Adding the dialog on the array:
      dialogs.push(dialog);

      // *Hiding the dialog and setting up the fading animation duration (only works when subscribing after DOM loads):
      dialog.getDOM()
         .css('animation-duration', (fade_animation_time/1000) + 's')
         .hide();
   }



   /**
    * Queues up a new dialog
    * @param  {string} dialog_name        The name of the dialog to be queued
    * @param  {object} params             The parameters that will be passed to its open listeners
    * @param  {function} onQuickDismiss   A dismiss listeners that will be called once when the user closes this dialog. It's not a permanent listener
    * @author Guilherme Reginaldo Ruella
    */
   function open(dialog_name, params, onQuickDismiss){
      // *Queueing up the dialog:
      queue.add({
         dialog_name: dialog_name,
         params: params,
         onQuickDismiss: onQuickDismiss
      });
   }



   /**
    * Dismisses the current dialog
    * @param  {number} status The dismissing status of this dialog, it could be either DIALOG_STATUS_NEGATIVE, DIALOG_STATUS_NEUTRAL, or DIALOG_STATUS_POSITIVE
    * @param  {object} params The parameters that will be passed to all dismiss listeners
    * @author Guilherme Reginaldo Ruella
    */
   function dismiss(status, params){
      // *Checking if there is a currently opened dialog, returning if there isn't:
      if(!current_dialog) return;

      // *Getting the current opened dialog:
      let dialog = current_dialog;

      // *Checking if the dialog has a quick dismiss action:
      if(dialog.getOnQuickDismiss()){
         // *If it has:
         // *Calling the action:
         dialog.getOnQuickDismiss()(dialog, status, params);
         // *Cleaning the action:
         dialog.setOnQuickDismiss(undefined);
      }

      // *Setting the dialog element as inactive:
      dialog.getDOM().removeClass('active');

      // *Checking if another dialog will be opened after this:
      if(!queue.hasNext()){
         // *If not:
         // *Setting the overlay element as inactive:
         getOverlay().removeClass('active');
      }

      // *Starting the dismiss animation time:
      setTimeout(() => {
         // *Calling all the dismissing event listeners:
         dialog.getOnDismiss().resolveAll(f => f(dialog, status, params));

         // *Hiding the dialog:
         dialog.getDOM().hide();

         // *Checking again if another dialog will be opened after this:
         if(!queue.hasNext()){
            // *Hiding the overlay:
            getOverlay().hide();
         }

         // *Reseting the current dialog flag:
         current_dialog = undefined;

         // *Calling next dialog on queue:
         queue.next();
      }, fade_animation_time);
   }



   /**
    * Defines an action to be executed when the dialog gets opened
    * @param  {string} dialog_name              The dialog's name
    * @param  {(function|function[])} action    The action to be done
    * @author Guilherme Reginaldo Ruella
    */
   function onOpen(dialog_name, action){
      // *Finding the dialog object:
      let dialog = findDialog(dialog_name);
      if(!dialog) return;

      // *Adding the action to the dialog's event handler:
      dialog.getOnOpen().addListener(action);
   }



   /**
   * Defines an action to be executed when the dialog gets dismissed
   * @param  {string} dialog_name              The dialog's name
   * @param  {(function|function[])} action    The action to be done
   * @author Guilherme Reginaldo Ruella
   */
   function onDismiss(dialog_name, action){
      // *Finding the dialog object:
      let dialog = findDialog(dialog_name);
      if(!dialog) return;

      // *Adding the action to the dialog's event handler:
      dialog.getOnDismiss().addListener(action);
   }



   /**
    * Sets the overlay container element that holds all dialogs
    * @param {string} element_id The overlay element id
    * @author Guilherme Reginaldo Ruella
    */
   function setOverlay(element_id){
      // *Setting the overlay container id:
      overlay_id = element_id;
   }



   /**
    * Retrieves the overlay container
    * @private
    * @return {[type]} The overlay container if set, or an empty jQuery element otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function getOverlay(){
      return $overlay || $('');
   }



   /**
    * Checks if a dialog exists, given its name
    * @private
    * @param  {string} dialog_name  The dialog's name
    * @return {boolean}             True if it exists, false otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function dialogExists(dialog_name){
      return dialogs.some(d => d.getName() === dialog_name);
   };



   /**
    * Retrieves a dialog, given its name
    * @private
    * @param  {string} dialog_name The dialog's name
    * @return {Dialog}             The Dialog object if found, undefined otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function findDialog(dialog_name){
      return dialogs.find(d => d.getName() === dialog_name);
   }



   /**
    * Retrieves all dialogs
    * @return {Dialog[]} The dialogs array
    * @author Guilherme Reginaldo Ruella
    */
   function getDialogs(){
      return dialogs;
   }



   // *When the DOM finished to load:
   $(() => {
      // *Checking if the overlay container id is set:
      if(overlay_id) {
         // *Setting the overlay element:
         $overlay = $(`#${overlay_id}`);

         // *Setting up the fading animation duration and hiding the overlay:
         $overlay.css('animation-duration', (fade_animation_time/1000) + 's').hide();

         // *Setting the overlay click action:
         $overlay.on('click', function(e){
            // *Checking if the user is clicking exactly at the overlay:
            if(this == e.target){
               // *If it is:
               // *Dismissing the current dialog:
               dismiss(DIALOG_STATUS_NEUTRAL);
            }
         });
      }

      // *Setting up all the dialogs:
      for(dialog of dialogs) {
         // *Setting up the fading animation duration and hiding the dialogs:
         dialog.getDOM()
            .css('animation-duration', (fade_animation_time/1000) + 's')
            .hide();
      }
   });



   // *Exporting this module:
   return {
      subscribe: subscribe,

      open: open,
      dismiss: dismiss,

      onOpen: onOpen,
      onDismiss: onDismiss,

      setOverlay: setOverlay,
      getDialogs: getDialogs,

      DIALOG_STATUS_NEGATIVE: DIALOG_STATUS_NEGATIVE,
      DIALOG_STATUS_NEUTRAL: DIALOG_STATUS_NEUTRAL,
      DIALOG_STATUS_POSITIVE: DIALOG_STATUS_POSITIVE
   };
})();
