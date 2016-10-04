
// *Global Variables:
let rest_url = 'http://localhost:3000';

// *Variable of authentication:
var authenticated = false;



// *Browsing the login page:
spa.onNavigate('login', (page, params) => {

   // *Building the event to the login form:
   $('#login-form').submit((e) => {

      // *The default action of the event will not be triggered:
      e.preventDefault();

      // *Retrieving the values of the fields 'Username' and 'Password':
      let text_username = $('#login-username-in').val();
      let text_pass = $('#login-pass-in').val();

      // *Sending Username and Password to the server through the method POST:
      $.ajax({
         url: rest_url + '/auth',
         method: 'POST',
         contentType: 'application/json;charset=UTF-8',
         data: JSON.stringify({login: text_username, pass: text_pass})
      }).done((data, textStatus, xhr) => {

         // *Saving user authentication data:
         saveAuthentication(data);

         // *Setting the variable value for true:
         authenticated = true;

         // *Redirecting the user to index page:
         spa.navigateTo('');

      }).fail((xhr, textStatus, err) => {
         console.log(textStatus);
      });
   });
});



// *The page loading:
spa.onReady(() => {

   // *Getting name previous page:
   let current_page_name = spa.getCurrentState().page_name;

   // *Checking if that name of the previous page is unlike 'auth':
   if(current_page_name !== 'auth') {
      spa.navigateTo('auth', {pagina_anterior: current_page_name});
   }
});



// *Browsing the auth page:
spa.onNavigate('auth', (page, params) => {

   // *Getting the key and the token:
   let auth = getAuthentication();

   // *Checking if the token or key is null:
   if(auth.token == null || auth.key == null) {

      // *If null:
      // *Redirecting the user to login page:
      spa.navigateTo('login');

   } else {

      // *If not null:
      // *Requesting authentication:
      $.ajax({
         url: rest_url + '/auth',
         method: 'GET',
         headers: {'Access-Token': auth.token, 'Access-Key': auth.key}
      }).done((data, textStatus, xhr) => {

         // *Setting the variable value for true:
         authenticated = true;

         // *Redirecting the user to previous page:
         spa.navigateTo(params.pagina_anterior);

      }).fail((xhr, textStatus, err) => {

         // *Redirecting the user to login page:
         spa.navigateTo('login');
      });
   }
});



// *Removing the event after unload the page:
spa.onUnload('login', (page, params) => {

   // *Removing the event submit:
   $('#login-form').off('submit');
});



/**
* Saves the authentication keys in cache
* @param  {object} data The token and the user key
* @author Ralf Pablo Braga Soares
*/
function saveAuthentication(data) {

   // *Setting token as an access key to the token code in cache:
   localStorage.setItem('token', JSON.stringify(data.token));

   // *saving key as an access key to the key code in cache:
   localStorage.setItem('key', JSON.stringify(data.user.login));
}



/**
* Recovers the authentication keys in cache
* @return {object} JSON The token and the user key
* @author Ralf Pablo Braga Soares
*/
function getAuthentication() {
   let token = JSON.parse(localStorage.getItem('token'));
   let key = JSON.parse(localStorage.getItem('key'));
   return {token: token, key: key};
}
