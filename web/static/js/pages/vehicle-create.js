// *When the user navigate to the vehicle-create page:
spa.onNavigate('vehicle-create', (page, params) => {
   let vehicle_photo_base64 = '';

   // *Checking if the user was authenticated:
   if(authenticated == true) {
      // *If true:
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

   // *Create a objetct to receiva values to create a vehicle:
   let object_data = {
      title: vehicle_title,
      manufacturer: vehicle_manufacturer,
      type: vehicle_type,
      year: vehicle_year,
      plate: vehicle_plate,
      renavam: vehicle_revavam,
      photo: vehicle_photo_base64
   }



   // *Sending a create Vehicle to the table vehicle on database:
   request.postVehicle(object_data)
      .done((data, textStatus, xhr) => {
         // *Showing the snack with the message:
         snack.open('Vehicle created', snack.TIME_SHORT);
         // *Going to index page:
         spa.navigateTo('');
      })
      .fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
}
