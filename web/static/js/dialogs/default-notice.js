// *When this dialog gets opened:
dialogger.onOpen('default-notice', (dialog, { title, message }) => {

   // *Setting the dialog's title text:
   $('#default-notice-title').text(title);

   // *Setting the dialog's message text:
   $('#default-notice-message').text(message);

   // *Setting an action for when the user clicks the 'OK' button:
   $('#default-notice-ok-button').on('click', e => {
      // *Dismissing this dialog as a neutral action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });
});



// *When the user closes this dialog:
dialogger.onDismiss('default-notice', (dialog, status, params) => {
   // *Cleaning the title text:
   $('#default-notice-title').text('');
   // *Cleaning the message text:
   $('#default-notice-message').text('');

   // *Cleaning the buttons' listeners:
   $('#default-notice-ok-button').off('click');
});
