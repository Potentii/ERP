// *When the user navigate to the user-update page:
spa.onNavigate('user-update', (page, params) => {
   let user_photo_base64 = undefined;

   // *Checking if the params is diferent undefined or null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:

         // *Removing the invalid state on the fields:
         mdl_util.clearTextFieldsValidity('#user-update-section');

         // *Show the page to update user:
         request.getUserSensitive(id)
            .done(data => {
               // *Setting the users's photo:
               $('#user-update-pic').parent().css('background-image', data.photo?'url(' + rest_url + '/media/u/p/'+ data.photo +')':'');

               // *Setting the user's name:
               $('#user-update-name').val(data.name);

               // *Setting the user's login:
               $('#user-update-login').val(data.login);

               // *Setting the user's password:
               $('#user-update-pass').val(data.pass);

               // *Setting the user's email:
               $('#user-update-email').val(data.email);

               // *Setting the user's phone:
               $('#user-update-phone').val(data.phone);

               // *Setting the user's department:
               $('#user-update-department').val(data.department);

               // *Setting id the user is active or not:
               $('#user-update-active').prop('checked', data.active?true:false);

               // *Setting the user's cpf:
               $('#user-update-cpf').val(data.cpf);

               // *Setting the user's driver license:
               $('#user-update-driver-license').val(data.driver_license);

               // *Setting the user's driver license expired date:
               $('#user-update-driver-license-exp').val(df.asFullDate(new Date(data.driver_license_exp)));

               // *Setting the user's permission for schedules:
               $('#user-update-permission-schedules').prop('checked', data.permission_schedules?true:false);

               // *Setting the user's permission for users:
               $('#user-update-permission-users').prop('checked', data.permission_users?true:false);

               // *Setting the user's permission for vechicles:
               $('#user-update-permission-vehicles').prop('checked', data.permission_vehicles?true:false);


               // *Updating MDL Textfields:
               mdl_util.updateTextFields('#user-update-section');

               // *Updating MDL Textfields:
               mdl_util.updateCheckBoxes('#user-update-section');
            })
            .fail(xhr => {
               console.log(xhr.responseJSON);
            });



         // *Listening to receive a photo in base64:
         $('#user-update-pic').on('change', (e) => {
            let user_pic_file = document.querySelector('#user-update-pic').files[0];
            file_encoder.asBase64(user_pic_file, res => {
               user_photo_base64 = res;

               // *Showing a preview of a photo to update user:
               $('#user-update-pic').parent().css('background-image', user_photo_base64?'url(' + user_photo_base64 + ')':'');
            });
         });



         // *When the user submits this form:
         $('#user-update-form').submit((e) => {
            // *Preventig the form to realod the page:
            e.preventDefault();

            // *Opening a dialog consent for the user:
            dialogger.open('default-consent', {title: srm.get('user-update-dialog-consent-submit-title'), message: srm.get('user-update-dialog-consent-submit-message')}, (dialog, status, params) => {
               // *Checking a status of dialog:
               switch(status){
               // *When the status is positive:
               case dialogger.DIALOG_STATUS_POSITIVE:

                  // *Calling the function to update user data:
                  updateUser(id, user_photo_base64);
                  break;
               }
            });
         });
      }
   } else {
      // *Is not diferent of null ou undefined:
      // *Send it to the users page:
      spa.navigateTo('users');
   }
});



// *When the user left this page:
spa.onUnload('user-update', (page) => {
   // *Cleaning the event submit:
   $('#user-update-form').off('submit');

   // *Cleaning the event change:
   $('#user-update-pic').off('change');

   // *Cleaning inputs when the page is left:
   $('#user-update-pic').val('');
   $('#user-update-name').val('');
   $('#user-update-login').val('');
   $('#user-update-pass').val('');
   $('#user-update-email').val('');
   $('#user-update-phone').val('');
   $('#user-update-department').val('');
   $('#user-update-pic').parent().css('background-image', '');
   $('#user-update-cpf').val('');
   $('#user-update-driver-license').val('');
   $('#user-update-driver-license-exp').val('');
   $('#user-update-active').prop('checked', true);
   $('#user-update-permission-users').prop('checked', false);
   $('#user-update-permission-schedules').prop('checked', false);
   $('#user-update-permission-vehicles').prop('checked', false);


   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#user-update-section');

   // *Updating MDL Textfields:
   mdl_util.updateCheckBoxes('#user-update-section');
});



/**
 * Send a request to REST to update this user
 * @param  {number} id                 The user's id
 * @param  {string} user_photo_base64  The base64 encoded image
 * @author Willian Conti Rezende
 */
function updateUser(id, user_photo_base64){

   // *Create a object to receiva values to update a user:
   let data_update_user = {
      name: $('#user-update-name').val(),
      login: $('#user-update-login').val(),
      pass: $('#user-update-pass').val(),
      email: $('#user-update-email').val(),
      cpf: $('#user-update-cpf').val(),
      phone: $('#user-update-phone').val(),
      driver_license: $('#user-update-driver-license').val(),
      driver_license_exp: $('#user-update-driver-license-exp').val(),
      department: $('#user-update-department').val(),
      photo: user_photo_base64,
      active: $('#user-update-active').is(':checked'),
      permission_schedules: $('#user-update-permission-schedules').is(':checked'),
      permission_users: $('#user-update-permission-users').is(':checked'),
      permission_vehicles: $('#user-update-permission-vehicles').is(':checked')
   };


   // *Sending the put request:
   request.putUser(id, data_update_user)
      .done(data => {
         // *Showing the snack with the message:
         snack.open(srm.get('user-update-successful-snack'), snack.TIME_SHORT);
         // *Going to index page:
         spa.navigateTo('users');
      })
      .fail(xhr => {
         // *Declaring an object to receiva a text to dialog:
         let text = {title: '', message: ''};

         // *Getting a error code
         switch(xhr.responseJSON.err_code){
         // *When the user couldn't be found:
         case 'ERR_NOT_FOUND':
            text.title = srm.get('user-update-dialog-error-not-found-title');
            text.message = srm.get('user-update-dialog-error-not-found-message');
            break;
         // *When some info has being duplicated:
         case 'ERR_DUPLICATE_FIELD':
            text.title = srm.get('user-update-dialog-error-duplicate-title');
            text.message = srm.get('user-update-dialog-error-duplicate-message');
            break;

         default:
            text.title = srm.get('user-update-dialog-error-default-title');
            text.message = srm.get('user-update-dialog-error-default-message');
            break;
         }

         // *Opening a dialog notice for the user:
         dialogger.open('default-notice', text);
      });
}
