

// *Browsing the user-picker dialog:
dialogger.onOpen('user-picker', (dialog, params) => {

   // *Setting the id of the user selected previous:
   let selected_user = params.previous_selected_user;

   // *Building the user's ul:
   let userPicker_ul = $('#user-picker-list');

   // *Listing the users:
   request.getUsers()
      .done(data => {
         // *Setting data with the user filter active:
         data = data.filter(user => user.active);

         // *Checking if the list is empty, adding the empty class if it is:
         if(!data.length) userPicker_ul.addClass('empty');

         // *Iterating and creating the users list:
         data.forEach(user => {

            // *Building the user's li:
            let userPicker_li = $('<li>').attr('data-id', user.id).addClass('row vertical-layout').appendTo(userPicker_ul);

            // *Building the user's div:
            let horizontal_layout_div = $('<div>').addClass('flex-horizontal-layout thumbnailed-info').appendTo(userPicker_li);

            // *Building and setting the user's photo:
            let image_div = $('<div>').addClass('round-thumbnail size-3').css('background-image', user.photo?'url('+ rest_url + '/media/u/p/' + user.photo +')':'').appendTo(horizontal_layout_div);

            // *Building the user's div:
            let vertical_layout_div = $('<div>').addClass('vertical-layout').appendTo(horizontal_layout_div);

            // *Building and setting the user's name and description:
            $('<span>').addClass('primary').text(user.name).appendTo(vertical_layout_div);
            $('<span>').addClass('secondary').text(user.login).appendTo(vertical_layout_div);

            // *Checking if the user selected is exactly equals user.id:
            if(user.id === selected_user){
               // *If this:
               // *Adding a user's li class:
               userPicker_li.addClass('selected');
            } else {
               // *If not:
               // *Removing the user's li class:
               userPicker_li.removeClass('selected');
            }
         });



         // *When a user click in a item list:
         userPicker_ul.on('click', 'li', function(){

            // *Removing all user's li class:
            $('#user-picker-list > .selected').removeClass('selected');

            // *Adding a user's li class:
            $(this).addClass('selected');

            // *Setting the selected_user:
            selected_user = $(this).data('id');
         });
      })
      .fail(xhr => {
         // *Checking if the request's status is 401, sending the user to the login page if it is:
         if(xhr.status === 401){
            spa.navigateTo('login');
            return;
         }
         console.log(xhr.responseJSON);
      });

   // *When the user click on a cancel button the dialog:
   $('#user-picker-cancel-button').on('click', e => {
      // *Assigning status neutral to the dialog:
      dialogger.dismiss(dialogger.DIALOG_STATUS_NEUTRAL);
   });

   // *When the user click on a ok button the dialog:
   $('#user-picker-ok-button').on('click', e => {
      // *Assigning status positive to the dialog and passing the user id by parameter:
      dialogger.dismiss(dialogger.DIALOG_STATUS_POSITIVE, {id: selected_user});
   });
});



// *When user left the dialog:
dialogger.onDismiss('user-picker', (dialog, status, params) => {

   // *Removing the list's empty class and the click listener:
   $('#user-picker-list')
      .removeClass('empty')
      .off('click');

   // *Removing all list items:
   $('#user-picker-list > li').remove();

   // *Removing the event click:
   $('#user-picker-cancel-button').off('click');
   $('#user-picker-ok-button').off('click');
});
