
// *Global Variables:
// *Variable of authentication:
var authenticated = false;



// *Browsing the login page:
spa.onNavigate('login', (page, params) => {

   // *Building the event to the login form:
   $('#login-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();

      // *Retrieving the values of the all fields:
      let text_username = $('#login-username-in').val();
      let text_pass = $('#login-pass-in').val();

      // *Cleaning the login error output:
      $('#login-error-output').text('');

      // *Saving all values in a object_data:
      let object_data = {login: text_username, pass: text_pass};

      // *Sending the login info to REST:
      request.postAuth(object_data)
         .done(data => {

            // *Saving user authentication data:
            request.saveAccessInfo({id: data.user.id, key: data.user.login, token: data.token});

            // *Setting the variable value for true:
            authenticated = true;

            // *Redirecting the user to index page:
            spa.navigateTo('');
         })
         .fail(xhr => {
            // *Declaring the text variable:
            let text = '';

            // *Checking the error code:
            switch(xhr.responseJSON.err_code){
            case 'ERR_INVALID_CREDENTIALS':
               // *If the credentials aren't valid:
               text = srm.get('login-error-invalid-credentials');
               break;

            case 'ERR_USER_NOT_ACTIVE':
               // *If the user isn't active:
               text = srm.get('login-error-user-not-active');
               break;

            default:
               // *If none of the above:
               text = srm.get('login-error-default');
               break;
            }

            // *Displaying the error text:
            $('#login-error-output').text(text);
         });
   });
});



// *When the SPA gets ready:
spa.onReady(() => {

   // *Getting name previous page:
   let current_page_name = spa.getCurrentState().page_name;

   // *Checking if that name of the previous page is unlike 'auth':
   if(current_page_name !== 'auth') {
      spa.navigateTo('auth', {previous_page_name: current_page_name});
   }
});



// *Browsing the auth page:
spa.onNavigate('auth', (page, params) => {

   // *Getting the key and the token:
   let auth = request.retrieveAccessInfo();

   // *Checking if the token or key is null:
   if(auth.token == null || auth.key == null) {

      // *If null:
      // *Redirecting the user to login page:
      spa.navigateTo('login');

   } else{
      // *If not null:

      // *Checking if the previous page name is set:
      if(params && (params.previous_page_name!==undefined || params.previous_page_name!==null)){
      // *If it is:
      // *Requesting for the user authentication:
      request.getAuth()
         .done(data => {

            // *Setting the authenticated variable value as true:
            authenticated = true;
            // *Redirecting the user to previous page:
            spa.navigateTo(params.previous_page_name);
         })
         .fail(xhr => {
            // *Redirecting the user to login page:
            spa.navigateTo('login');
         });
      } else{
         // *If it's not:
         // *Backing the history two pages:
         history.back();
         history.back();
      }
   }
});



// *Removing the event after unload the page:
spa.onLeft('login', (page) => {

   // *Removing the event submit:
   $('#login-form').off('submit');
});
