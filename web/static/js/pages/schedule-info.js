


// *Browsing the schedule-info page:
spa.onNavigate('schedule-info', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined)){
      let id = params.id;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Listing the reserve info of that vehicle:
         request.getSchedule(id)
            .done((data, textStatus, xhr) => {

               // *Setting the schedule reason:
               $('#schedule-info-reason').text(data.reason);

               // *Setting the schedule start date:
               let start_date = new Date(data.start_date);
               $('#schedule-info-start-date').text(df.asShortDate(start_date));

               // *Setting the schedule start time:
               let start_time = new Date(data.start_date);
               $('#schedule-info-start-time').text(df.asShorterTime(start_time));

               // *Setting the schedule end time:
               let end_time = new Date(data.end_date);
               $('#schedule-info-end-time').text(df.asShorterTime(end_time));

               // *Setting the schedule end date:
               let end_date = new Date(data.end_date);
               $('#schedule-info-end-date').text(df.asShortDate(end_date));

               // *Setting the schedule's create date:
               let create_date = new Date(data.date);
               $('#schedule-info-date').text(df.asShortDate(create_date));

               // *Showing the vehicle in app bar:
               request.getVehicle(data.id_vehicle_fk)
                  .done((data, textStatus, xhr) => {

                     // *Setting the vehicle's photo:
                     $('#schedule-info-vehicle-photo').css('background-image', 'url(' + rest_url + '/media/v/p/' + data.photo + ')');

                     // *Setting the vehicle's title and plate:
                     $('#schedule-info-vehicle-title').text(data.title + " - " + data.plate);

                     // *Setting the vehicle's type, year and manufacturer:
                     $('#schedule-info-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);

                  })
                  .fail((xhr, textStatus, err) => {
                     console.log(textStatus);
                  });

                  // *Showing the user in app bar:
                  request.getUser(data.id_user_fk)
                     .done((data, textStatus, xhr) => {

                        // *Setting the user's username:
                        $('#schedule-info-user-name').text(data.name);
                     })
                     .fail((xhr, textStatus, err) => {
                        console.log(textStatus);
                     });
            });
     }
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('schedules');
   }
});

// *removing scheduling
$('#schedule-info-delete-fab').on('click', function(){
   let id = params.id;

   // *Sending a request to delete the schedule:
   request.deleteSchedule(id)
      .done((data, textStatus, xhr) => {

         // *Navigating to index page:
         spa.navigateTo('');
      })
       .fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
});

spa.onUnload('schedule-info', (page, params) => {
   // *Removing the event click:
   $('#schedule-info-delete-fab').off('click');
});
