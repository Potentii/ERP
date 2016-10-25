spa.onReady(() => {
   // *Setup period validation on create form:
   setupSchedulePeriodsValidation(
      'schedule-create-section',
      $('#schedule-create-start-date'),
      $('#schedule-create-start-time'),
      $('#schedule-create-end-date'),
      $('#schedule-create-end-time'));

   // *Setup period validation on update form:
   setupSchedulePeriodsValidation(
      'schedule-update-section',
      $('#schedule-update-start-date'),
      $('#schedule-update-start-time'),
      $('#schedule-update-end-date'),
      $('#schedule-update-end-time'));

   function setupSchedulePeriodsValidation(section_id, $start_date, $start_time, $end_date, $end_time){

      // *When the start date changes:
      $start_date.on('change', function(){
         // *Getting the current date:
         let now = new Date();

         // *Triggering the start time validation:
         $start_time.trigger('change');

         // *Triggering the end date validation:
         $end_date.trigger('change');

         // *Getting the string representation of current day:
         let now_date_str = df.asMysqlDate(now);
         // *Checking if the min property is already valid:
         if(now_date_str !== $(this).attr('min')){
            // *If it doesn't:
            // *Setting the min property:
            $(this).attr('min', now_date_str);
         }
      });


      // *When the start time changes:
      $start_time.on('change', function(){
         // *Getting the informed begining date string:
         let start_date = $start_date.val();
         // *Getting the current date:
         let now = new Date();

         // *Triggering the end time validation:
         $end_time.trigger('change');

         // *Checking if the user selected today:
         if(df.asMysqlDate(now) === start_date){
            // *If they did:
            // *Getting the string representation of current time:
            let now_time_str = df.asShorterTime(now);
            // *Checking if the min property is already valid:
            if(now_time_str !== $(this).attr('min')){
               // *If it doesn't:
               // *Setting the min property:
               $(this).attr('min', now_time_str);
            }
         } else{
            // *If they didn't:
            // *Checking if the min property is already valid:
            if($(this).attr('min') !== '00:00'){
               // *If it doesn't:
               // *Setting the min property:
               $(this).attr('min', '00:00');
            }
         }
      });


      // *When the end date changes:
      $end_date.on('change', function(){
         // *Getting the informed begining date string:
         let start_date = $start_date.val();

         // *Triggering the end time validation:
         $end_time.trigger('change');

         // *Checking if the min property is already valid:
         if(start_date !== $(this).attr('min')){
            // *If it doesn't:
            // *Setting the min property:
            $(this).attr('min', start_date);
         }
      });


      // *When the end time changes:
      $end_time.on('change', function(){
         // *Getting the informed begining date string:
         let start_date = $start_date.val();
         // *Getting the informed ending date string:
         let end_date = $end_date.val();
         // *Getting the informed begining time string:
         let start_time = $start_time.val();

         // *Checking if the schedule starts and ends on the same day:
         if(start_date === end_date){
            // *If it is:
            // *Checking if the min property is already valid:
            if(start_time !== $(this).attr('min')){
               // *If it doesn't:
               // *Setting the min property:
               $(this).attr('min', start_time);
            }
         } else{
            // *If it isn't:
            // *Checking if the min property is already valid:
            if($(this).attr('min') !== '00:00'){
               // *If it doesn't:
               // *Setting the min property:
               $(this).attr('min', '00:00');
            }
         }
      });


      // *When the end time changes:
      $end_time.on('change', function(){
         // *Updating MDL Textfields:
         mdl_util.updateTextFields('#' + section_id);
      });
   }
});
