

// *When the user navigate to the user-create page:
spa.onNavigate('user-create', (page, params) => {
   let user_photo_base64 = '';

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      // *Removing the invalid state on the fields:
      mdl_util.clearTextFieldsValidity('#user-create-section');

      // *Listening to receive a photo in base64:
      $('#user-create-pic').on('change', (e) => {
         let user_pic_file = document.querySelector('#user-create-pic').files[0];
         file_encoder.asBase64(user_pic_file, res => {
            user_photo_base64 = res;

            // *Showing a preview of a photo to create user:
            $('#user-create-pic').parent().css('background-image', user_photo_base64?'url(' + user_photo_base64 + ')':'');
         });
      });



      // *Button to call a function postUser and prevent the action default of browser happen:
      $('#user-create-form').on('submit', (e) => {
         e.preventDefault();

         // *Calling the function to create a new user:
         postUser(user_photo_base64);
      });
   }
});


// *When the user left the page:
spa.onUnload('user-create', (page) => {
   // *Cleaning the event submit:
   $('#user-create-form').off('submit');
   // *Cleaning the event change:
   $('#user-create-pic').off('change');
   // *Cleaning inputs when the page is left:
   $('#user-create-pic').val('');
   $('#user-create-name').val('');
   $('#user-create-login').val('');
   $('#user-create-pass').val('');
   $('#user-create-email').val('');
   $('#user-create-phone').val('');
   $('#user-create-department').val('');
   $('#user-create-pic').parent().css('background-image', '');
   $('#user-create-cpf').val('');
   $('#user-create-driver-license').val('');
   $('#user-create-driver-license-exp').val('');
   $('#user-create-active').prop('checked', true);
   $('#user-create-permission-schedules').prop('checked', false);
   $('#user-create-permission-users').prop('checked', false);
   $('#user-create-permission-vehicles').prop('checked', false);

   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#user-create-section');

   // *Updating MDL Textfields:
   mdl_util.updateCheckBoxes('#user-create-section');
});



/**
* Sends the schedule create request to REST
* @param  {string} user_photo_base64 The base64 encoded user image
* @author Dennis Sakaki Fujiki
*/
function postUser(user_photo_base64){


   // *Saving all values in a object_data:
   let object_data = {
      name: $('#user-create-name').val(),
      login: $('#user-create-login').val(),
      pass: $('#user-create-pass').val(),
      email: $('#user-create-email').val(),
      cpf: $('#user-create-cpf').val(),
      phone: $('#user-create-phone').val(),
      driver_license: $('#user-create-driver-license').val(),
      driver_license_exp: $('#user-create-driver-license-exp').val(),
      department: $('#user-create-department').val(),
      photo: user_photo_base64,
      active: $('#user-create-active').is(':checked'),
      permission_schedules: $('#user-create-permission-schedules').is(':checked'),
      permission_users: $('#user-create-permission-users').is(':checked'),
      permission_vehicles: $('#user-create-permission-vehicles').is(':checked')
   }

   // *Sending a request to register user:
   request.postUser(object_data)
      .done(data => {
         // *Showing the snack with the message:
         snack.open(srm.get('user-create-successful-snack'), snack.TIME_SHORT);
         // *Sending the user to the user listing:
         spa.navigateTo('users');
      })
      .fail(xhr => {
         let text = {title: '', message: ''};

         // *Checking the error code:
         switch(xhr.responseJSON.err_code){

         // *Case there is some required field not filled:
         case 'ERR_MISSING_FIELD':
            text.title = srm.get('user-create-dialog-error-missing-field-title');
            text.message = srm.get('user-create-dialog-error-missing-field-message');
            break;

         // *Case when a unique fiel being repeated:
         case 'ERR_DUPLICATE_FIELD':
            text.title = srm.get('user-create-dialog-error-duplicate-title');
            text.message = srm.get('user-create-dialog-error-duplicate-message');
            break;

         default:
            text.title = srm.get('user-create-dialog-error-default-title');
            text.message = srm.get('user-create-dialog-error-default-message');
            break;
         }

         // *Opening a dialog notice for the user:
         dialogger.open('default-notice', text);
      });
}
