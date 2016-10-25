


// *Browsing the schedules page:
spa.onNavigate('schedules', (page, params) => {

   // *Checking if the params is diferent undefined ou null:
   if(params && (params.id !== null && params.id !== undefined) && (params.date !== null && params.date !== undefined)){
      let id = params.id;
      let date = params.date;

      // *Checking if the user was authenticated:
      if(authenticated == true) {
         // *If true:
         // *Showing the vehicle in app bar:
         request.getVehicle(id, date)
            .done(data => {

               // *Setting the vehicle's photo:
               $('#schedules-vehicle-photo').css('background-image', 'url(' + rest_url + '/media/v/p/' + data.photo + ')');

               // *Setting the vehicle's title and plate:
               $('#schedules-vehicle-title').text(data.title + " - " + data.plate);

               // *Setting the vehicle's type, year and manufacturer:
               $('#schedules-vehicle-description').text(data.type + " - " + data.year + " - " + data.manufacturer);

               // *Setting the vehicle schedule date:
               $('#schedules-vehicle-date').text(df.asFullDate(new Date(date + ' 00:00:00')));

               // *Checking if the vehicle is active:
               if(data.active){
                  // *If it is:
                  // *Showing the 'Add schedules' FAB:
                  $('#schedules-create-done-fab').show();
               } else{
                  // *If it isn't:
                  // *Hiding the 'Add schedules' FAB:
                  $('#schedules-create-done-fab').hide();
               }
            })
            .fail(xhr => {
               console.log(xhr.responseJSON);
            });

         // *Listing the reserves of that vehicle:
         request.getVehiclesReservationsOnDate(id, date)
            .done(data => {

               // *Building the schedule's ul:
               let schedules_ul = $('#schedules-list');

               // *Checking if the list is empty, adding the empty class if it is:
               if(!data.length) schedules_ul.addClass('empty');

               // *Iterating and creating the schedules list:
               data.forEach(function(reservations){

                  // *Building the schedule's li:
                  let schedules_li = $('<li>').attr('data-id', reservations.schedule.id).addClass('card box raised').appendTo(schedules_ul);

                  // *Building the schedule's div:
                  let vertical_layout_div = $('<div>').addClass('user vertical-layout').appendTo(schedules_li);

                  // *Building and setting the name and reason of the user:
                  let schedules_user = $('<span>').addClass('primary').text(reservations.user.name).appendTo(vertical_layout_div);
                  let schedules_reason = $('<span>').addClass('secondary').text(reservations.schedule.reason).appendTo(vertical_layout_div);

                  // *Building the schedule's duration div:
                  let schedules_duration_div = $('<div>').addClass('schedule-duration-output').appendTo(schedules_li);

                  // *Building and setting the schedule start date:
                  let start_date = new Date(reservations.schedule.start_date);
                  let schedules_start_date = $('<span>').text(df.asShortDate(start_date));
                  schedules_start_date.appendTo(schedules_duration_div);

                  // *Building and setting the schedule start time:
                  let start_time = new Date(reservations.schedule.start_date);
                  let schedules_start_time = $('<span>').addClass('secondary').text(df.asShorterTime(start_time));
                  schedules_start_time.appendTo(schedules_duration_div);

                  // *Icon between dates:
                  let icon = $('<i>').addClass('material-icons secondary').text('more_vert');
                  $(icon).appendTo(schedules_duration_div);

                  // *Building and setting the schedule end time:
                  let end_time = new Date(reservations.schedule.end_date);
                  let schedules_end_time = $('<span>').addClass('secondary').text(df.asShorterTime(end_time));
                  schedules_end_time.appendTo(schedules_duration_div);

                  // *Building and setting the schedule end date:
                  let end_date = new Date(reservations.schedule.end_date);
                  let schedules_end_date = $('<span>').text(df.asShortDate(end_date));
                  schedules_end_date.appendTo(schedules_duration_div);
               });

               // *Clicking on a reservation:
               schedules_ul.on('click', 'li', function(){
                  let id = $(this).data('id');

                  // *Sending the id of the li by parameter:
                  spa.navigateTo('schedule-info', {id: id});
               });

            })
            .fail(xhr => {
               console.log(xhr.responseJSON);
            });
      }

      // *When a user to click in add button:
      $('#schedules-create-done-fab').on('click', function(){
         let id = params.id;
         let date = params.date;

         // *Sending the id of the vehicle by parameter:
         spa.navigateTo('schedule-create', {id: id, date: date});
      });
   } else {
      // *Is not diferent of null ou undefined:
      // *Redirecting the user to index page:
      spa.navigateTo('');
   }
});



// *Defining ul like empty after unload the page:
spa.onUnload('schedules', (page) => {

   // *Removing the list's empty class and the click listener:
   $('#schedules-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#schedules-list > li').remove();

   // *Removing the event click from button:
   $('#schedules-create-done-fab').off('click');

   // *Hiding the 'Add schedules' FAB:
   $('#schedules-create-done-fab').show();
});
