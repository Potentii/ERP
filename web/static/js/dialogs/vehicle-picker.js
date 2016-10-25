

// *Browsing the vehicle-picker dialog:
dialogger.onOpen('vehicle-picker', (dialog, params) => {

   // *Checking if the previous selected vehicle was set:
   if(!params || (params.previous_selected_vehicle === null || params.previous_selected_vehicle === undefined)){
      // *If it wasn't:
      // *Assigning status neutral to the dialog:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
      return;
   }

   // *Setting the id of the user selected previous:
   let selected_vehicle = params.previous_selected_vehicle;

   // *Building the user's ul:
   let vehiclePicker_ul = $('#vehicle-picker-list');

   // *Listing the users:
   request.getVehicles()
      .done(data => {
         // *Setting data with the vehicle filter active:
         data = data.filter(vehicle => vehicle.active);

         // *Checking if the list is empty, adding the empty class if it is:
         if(!data.length) vehiclePicker_ul.addClass('empty');

         // *Iterating and creating the users list:
         data.forEach(vehicle => {

            // *Building the user's li:
            let vehiclePicker_li = $('<li>').attr('data-id', vehicle.id).addClass('row').appendTo(vehiclePicker_ul);

            // *Building the vehicle's div:
            let horizontal_layout_div = $('<div>').addClass('flex-horizontal-layout thumbnailed-info').appendTo(vehiclePicker_li);

            // *Building and setting the vehicle's photo:
            let image_div = $('<div>').addClass('round-thumbnail size-3').css('background-image', vehicle.photo?'url('+ rest_url + '/media/v/p/' + vehicle.photo +')':'').appendTo(horizontal_layout_div);

            // *Building the vehicle's div:
            let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

            // *Building and setting the vehicle's title and plate:
            $('<span>').addClass('primary').text(vehicle.title + ' - ' + vehicle.plate).appendTo(vertical_layout_div);

            // *Building and setting the vehicle's year, type and manufacturer:
            $('<span>').addClass('secondary').text(vehicle.year + ' - ' + vehicle.type + ' - ' + vehicle.manufacturer).appendTo(vertical_layout_div);

            // *Checking if the vehicle selected is exactly equals vehicle.id:
            if(vehicle.id === selected_vehicle){
               // *If this:
               // *Adding a vehicle's li class:
               vehiclePicker_li.addClass('selected');
            } else {
               // *If not:
               // *Removing the vehicle's li class:
               vehiclePicker_li.removeClass('selected');
            }
         });


         // *When a vehicle click in a item list:
         vehiclePicker_ul.on('click', 'li', function(){

            // *Removing all vehicle's li class:
            $('#vehicle-picker-list > .selected').removeClass('selected');

            // *Adding a vehicle's li class:
            $(this).addClass('selected');

            // *Setting the selected_vehicle:
            selected_vehicle = $(this).data('id');
         });
      })
      .fail(xhr => {
         console.log(xhr.responseJSON);
      });

   // *When the vehicle click on a cancel button the dialog:
   $('#vehicle-picker-cancel-button').on('click', e => {
      // *Assigning status neutral:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *When the vehicle click on a ok button the dialog:
   $('#vehicle-picker-ok-button').on('click', e => {
      // *Assigning status positive and passing the vehicle id by parameter:
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, {id: selected_vehicle});
   });
});



// *When user left the dialog:
dialogger.onDismiss('vehicle-picker', (dialog, status, params) => {

   // *Removing the list's empty class and the click listener:
   $('#vehicle-picker-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#vehicle-picker-list > li').remove();

   // *Removing the event click:
   $('#vehicle-picker-cancel-button').off('click');
   $('#vehicle-picker-ok-button').off('click');
});
