


// *Browsing the vehicle-info page:
spa.onNavigate('vehicle-info', (page, params) => {

   // *Playing the inflation animation on the FAB:
   anim.inflate($('#vehicle-info-edit-fab'));
   anim.inflate($('#vehicle-info-delete-fab'));

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;
      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the vehicle:
         request.getVehicle(id)
            .done((data, textStatus, xhr) => {

               // *Checking if the vehicle is active:
               if(data.active === 1){
                  // *If true:
                  // *Showing div vehicle-info-active-true:
                  // *Hiding div vehicle-info-active-false:
                  $('#vehicle-info-active-true').parent().parent('.row').show();
                  $('#vehicle-info-active-false').parent().parent('.row').hide();

                 // *Checking if the vehicle isn't active:
              } else if (data.active === 0) {
                 // *If true:
                 // *Showing div vehicle-info-active-false:
                 // *Hiding div vehicle-info-active-true:
                  $('#vehicle-info-active-false').parent().parent('.row').show();
                  $('#vehicle-info-active-true').parent().parent('.row').hide();
               }

               // *Setting the vehicle's photo:
               $('#vehicle-info-photo').css('background-image', data.photo?'url(' + rest_url + '/media/v/p/'+ data.photo +')':'');

               // *Setting the vehicle's title and plate:
               $('#vehicle-info-title').text(data.title + ' - ' + data.plate);

               // *Setting the vehicle's type, year and manufacturer:
               $('#vehicle-info-description').text(data.type + ' - ' + data.year + ' - ' + data.manufacturer);

               // *Setting the vehicle's renavam and registred date:
               $('#vehicle-info-renavam').text(data.renavam);
               let date = new Date(data.date);
               $('#vehicle-info-date').text(df.asFullDate(date));
            })
            .fail((xhr, textStatus, err) => {
               console.log(textStatus);
            });
      }

      // *When a user to click in update button:
      $('#vehicle-info-edit-fab').on('click', function(){
          // *Sending the user's to the vehicle-update page:
          spa.navigateTo('vehicle-update', {id: id});
      });
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});


// *When user left the page:
spa.onUnload('vehicle-info', (page) => {

   // *Removing the event click:
   $('#vehicle-info-edit-fab').off('click');
});
