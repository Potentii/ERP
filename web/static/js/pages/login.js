
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

      // *Saving all values in a object_data:
      let object_data = {login: text_username, pass: text_pass};

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
            // *Checking if the request's status is 401, sending the user to the login page if it is:
            if(xhr.status === 401){
               spa.navigateTo('login');
               return;
            }
            let text = {title: '', message: ''};

            // *Checking the error code:
            switch(xhr.responseJSON.err_code){

            // *Case the credentials aren't valid:
            case 'ERR_INVALID_CREDENTIALS':
               text.title = srm.get('login-dialog-error-invalid-credentials-title');
               text.message = srm.get('login-dialog-error-invalid-credentials-message');
               break;

            // *Case the user isn't active:
            case 'ERR_USER_NOT_ACTIVE':
                text.title = srm.get('login-dialog-error-inactive-title');
                text.message = srm.get('login-dialog-error-inactive-message');
                break;

            default:
                text.title = srm.get('login-dialog-error-default-title');
                text.message = srm.get('login-dialog-error-default-message');
                break;
            }

            // *Opening a dialog notice for the user:
            dialogger.open('default-notice', text);
         });
   });
});



// *The page loading:
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

   } else {
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
