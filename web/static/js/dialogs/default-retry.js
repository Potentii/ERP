// *When this dialog gets opened:
dialogger.onOpen('default-retry', (dialog, { title, message }) => {

   // *Setting the dialog's title text:
   $('#default-retry-title').text(title);

   // *Setting the dialog's message text:
   $('#default-retry-message').text(message);

   // *Setting an action for when the user clicks the 'CANCEL' button:
   $('#default-retry-cancel-button').on('click', e => {
      // *Dismissing this dialog as a neutral action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *Setting an action for when the user clicks the 'RETRY' button:
   $('#default-retry-retry-button').on('click', e => {
      // *Dismissing this dialog as a positive action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE);
   });
});



// *When the user closes this dialog:
dialogger.onDismiss('default-retry', (dialog, status, params) => {
   // *Cleaning the title text:
   $('#default-retry-title').text('');
   // *Cleaning the message text:
   $('#default-retry-message').text('');

   // *Cleaning the buttons' listeners:
   $('#default-retry-cancel-button').off('click');
   $('#default-retry-retry-button').off('click');
});
