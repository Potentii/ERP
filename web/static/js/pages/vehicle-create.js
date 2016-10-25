

// *When the user navigate to the vehicle-create page:
spa.onNavigate('vehicle-create', (page, params) => {
   let vehicle_photo_base64 = '';

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:

      // *Removing the invalid state on the fields:
      mdl_util.clearTextFieldsValidity('#vehicle-create-section');

      // *Listening to receiva a photo in base64:
      $('#vehicle-create-pic').on('change', (e) => {
         let vehicle_pic_file = document.querySelector('#vehicle-create-pic').files[0];
         file_encoder.asBase64(vehicle_pic_file, res => {
            vehicle_photo_base64 = res;

            // *Showing a preview of a photo to create vehicle:
            $('#vehicle-create-pic').parent().css('background-image', vehicle_photo_base64?'url(' + vehicle_photo_base64 + ')':'');
         });
      });



      // *Button to call a function createVehicle and prevent the action default of browser happen:
      $('#vehicle-create-form').on('submit', (e) => {
         e.preventDefault();

         // *Calling the function to create a new vehicle:
         createVehicle(vehicle_photo_base64);
      });
   }
});



// *Cleaning listernes from this page:
spa.onUnload('vehicle-create', (page) => {
   // *Cleaning the event submit:
   $('#vehicle-create-form').off('submit');
   // *Cleaning the event change:
   $('#vehicle-create-pic').off('change');
   // *Cleaning inputs when the page is left:
   $('#vehicle-create-pic').val('');
   $('#vehicle-create-title').val('');
   $('#vehicle-create-manufacturer').val('');
   $('#vehicle-create-type').val('');
   $('#vehicle-create-year').val('');
   $('#vehicle-create-plate').val('');
   $('#vehicle-create-renavam').val('');
   $('#vehicle-create-pic').parent().css('background-image', '');
   $('#vehicle-create-active').prop('checked', true);

   // *Updating MDL Textfields:
   mdl_util.updateTextFields('#vehicle-create-section');

   // *Updating MDL Textfields:
   mdl_util.updateCheckBoxes('#vehicle-create-section');
});



/**
 * Sends a vehicle creation request to REST
 * @param  {string} vehicle_photo_base64 The base64 encoded vehicle image
 * @author Dennis Sakaki Fujiki
 */
function createVehicle(vehicle_photo_base64){

   // *Getting data of inputs:
   let vehicle_pic = $('#vehicle-create-pic').val();
   let vehicle_title = $('#vehicle-create-title').val();
   let vehicle_manufacturer = $('#vehicle-create-manufacturer').val();
   let vehicle_type = $('#vehicle-create-type').val();
   let vehicle_year = $('#vehicle-create-year').val();
   let vehicle_plate = $('#vehicle-create-plate').val();
   let vehicle_revavam = $('#vehicle-create-renavam').val();
   let vehicle_active = $('#vehicle-create-active').is(':checked');

   // *Create a objetct to receiva values to create a vehicle:
   let object_data = {
      title: vehicle_title,
      manufacturer: vehicle_manufacturer,
      type: vehicle_type,
      year: vehicle_year,
      plate: vehicle_plate,
      renavam: vehicle_revavam,
      photo: vehicle_photo_base64,
      active: vehicle_active
   };



   // *Sending a create Vehicle to the table vehicle on database:
   request.postVehicle(object_data)
      .done(data => {
         // *Showing the snack with the message:
         snack.open(srm.get('vehicle-create-successful-snack'), snack.TIME_SHORT);
         // *Going to index page:
         spa.navigateTo('');
      })
      .fail(xhr => {
         let text = {title: '', message: ''};

         // *Switch to receive error code
         switch(xhr.responseJSON.err_code){

         // *Case there is some required field not filled
         case 'ERR_MISSING_FIELD':
            text.title = srm.get('vehicle-create-dialog-error-missing-field-title');
            text.message = srm.get('vehicle-create-dialog-error-missing-field-message');
            break;

         // *Case when a unique fiel being repeated:
         case 'ERR_DUPLICATE_FIELD':
            text.title = srm.get('vehicle-create-dialog-error-duplicate-title');
            text.message = srm.get('vehicle-create-dialog-error-duplicate-message');
            break;

         // *Action default of switch:
         default:
            text.title = srm.get('vehicle-create-dialog-error-default-title');
            text.message = srm.get('vehicle-create-dialog-error-default-message');
            break;
         }

         // *Open a dialog notice for the user:
         dialogger.open('default-notice', text);
      });
}
