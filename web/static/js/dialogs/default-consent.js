// *When this dialog gets opened:
dialogger.onOpen('default-consent', (dialog, { title, message }) => {

   // *Setting the dialog's title text:
   $('#default-consent-title').text(title);

   // *Setting the dialog's message text:
   $('#default-consent-message').text(message);

   // *Setting an action for when the user clicks the 'NO' button:
   $('#default-consent-no-button').on('click', e => {
      // *Dismissing this dialog as a negative action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEGATIVE);
   });

   // *Setting an action for when the user clicks the 'YES' button:
   $('#default-consent-yes-button').on('click', e => {
      // *Dismissing this dialog as a positive action:
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE);
   });
});



// *When the user closes this dialog:
dialogger.onDismiss('default-consent', (dialog, status, params) => {
   // *Cleaning the title text:
   $('#default-consent-title').text('');
   // *Cleaning the message text:
   $('#default-consent-message').text('');

   // *Cleaning the buttons' listeners:
   $('#default-consent-no-button').off('click');
   $('#default-consent-yes-button').off('click');
});
