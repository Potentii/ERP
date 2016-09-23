

/**
 * Module that manages and handles all the pages
 * @namespace SPA
 */
var spa = (function(){
   var spa_loaded = false;
   var ready_event = new HandledEvent();

   const pages = [];
   var fallback_page_name;
   var current_page_name;



   /**
    * Subscribes a new page to the SPA system
    * @param  {Page} page                             The page to subscribe
    * @param  {(function|function[])} load_action     The load callback
    * @param  {(function|function[])} unload_action   The unload callback
    * @author Guilherme Reginaldo Ruella
    */
   function subscribe(page, load_action, unload_action){
      // *If page argument isn't a Page, return:
      if(!(page instanceof Page)) return;

      // *If already exists a page with same name, return:
      if(pageExists(page.getName())) return;

      // *Adding the page on the array:
      pages.push(page);

      // *Checking if fallback page is already set:
      if(!fallback_page_name){
         // *If it isn't:
         setFallbackPage(page.getName());
      }

      // *Defining the default action for navigation:
      let defaultLoad = function(this_page, params){
         this_page.getDOM().show();
      }

      // *Defining the default action for unloading:
      let defaultUnload = function(this_page){
         this_page.getDOM().hide();
      }

      // *Hiding the page (only works when subscribing after DOM loads):
      page.getDOM().hide();

      // *Setting up default action to pages' load and unload events:
      spa.onNavigate(page.getName(), defaultLoad);
      spa.onUnload(page.getName(), defaultUnload);

      // *Adding all the custom callbacks:
      spa.onNavigate(page.getName(), load_action);
      spa.onUnload(page.getName(), unload_action);
   }



   /**
    * Navigates to a new page
    * @param  {string} [page_name=fallback_page_name]  Optional. The name of the page to load, if left empty, it'll load the fallback page
    * @param  {object} [params]                       Optional. The data to be used on the page
    * @author Guilherme Reginaldo Ruella
    */
   function navigateTo(page_name = fallback_page_name, params){

      // *If SPA isn't loaded yet, return:
      if(!spa_loaded) return;

      // *If it's an invalid page, return:
      if(!pageExists(page_name)) return;

      // *If it's the same page as before, return:
      if(history.state && page_name === history.state.page_name) return;

      // *Stacking up new state:
      history.pushState({page_name: page_name, params: params}, page_name, page_name || '/');

      // *Loading the new content, and erasing the old one:
      loadPage();
   };



   /**
    * Runs all navigation callbacks of the current page, and all unload callbacks for the previous page
    * @author Guilherme Reginaldo Ruella
    */
   function loadPage(){

      // *If SPA isn't loaded yet, return:
      if(!spa_loaded) return;

      // *Getting the page to load:
      let { page_name, params } = history.state;
      let page = findPage(page_name);

      // *Getting the page to unload:
      let previous_page = findPage(current_page_name);

      // *If it's the same page as before, return:
      if(page_name === current_page_name) return;

      // *Unloading the previous page:
      if(previous_page) previous_page.getOnUnload().resolveAll(f => f(previous_page));

      // *Changing the current page flag:
      current_page_name = page_name;

      // *Loading the new page:
      page.getOnNavigate().resolveAll(f => f(page, params));
   };



   /**
    * Defines an action to be executed when user navigate to a given page
    * @param  {string} page_name                The page's name
    * @param  {(function|function[])} action    The action to be done
    * @author Guilherme Reginaldo Ruella
    */
   function onNavigate(page_name, action){
      // *Finding the page object:
      let page = findPage(page_name);
      if(!page) return;

      // *Checking if it is trying to add listeners for the current page, and if spa is ready:
      if(history.state && history.state.page_name === page_name && spa_loaded){
         // *If it is:
         // *Calling immediately:
         action(page, history.state.params);
      }

      // *Adding the action to the page's event handler:
      page.getOnNavigate().addListener(action);
   }



   /**
    * Defines an action to be executed when user left a given page
    * @param  {string} page_name                The page's name
    * @param  {(function|function[])} action    The action to be done
    * @author Guilherme Reginaldo Ruella
    */
   function onUnload(page_name, action){
      // *Finding the page object:
      let page = findPage(page_name);
      if(!page) return;

      // *Adding the action to the page's event handler:
      page.getOnUnload().addListener(action);
   }



   /**
    * Adds an action listener that'll be called when SPA system is ready.
    * @param  {function} action The callback function to be called
    * @author Guilherme Reginaldo Ruella
    */
   function onReady(action){
      // *Checking if spa is already loaded:
      if(spa_loaded){
         // *If it is:
         // *Calling the action:
         action();
      } else{
         // *Or else:
         // *Adding to its event handler:
         ready_event.addListener(action);
      }
   }



   /**
    * Sets the fallback page
    * @param {string} page_name The page's name
    * @author Guilherme Reginaldo Ruella
    */
   function setFallbackPage(page_name){
      // *Changes the default page, if the given name is valid:
      fallback_page_name = pageExists(page_name)?page_name:fallback_page_name;
   }



   /**
    * Checks if a page exists, given its name
    * @param  {string} page_name The page's name
    * @return {boolean}          True if it exists, false otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function pageExists(page_name){
      return pages.some(p => p.getName() === page_name);
   };



   /**
    * Retrieves a page, given its name
    * @private
    * @param  {string} page_name The page's name
    * @return {Page}             The Page object if found, undefined otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function findPage(page_name){
      return pages.find(p => p.getName() === page_name);
   };



   /**
    * Retrieves all pages
    * @return {Page[]} The pages array
    * @author Guilherme Reginaldo Ruella
    */
   function getPages(){
      return pages;
   }



   /**
    * Returns the current state of spa
    * @return {object}  An object containing the current page_name and params
    */
   function getCurrentState(){
      return {page_name: history.state.page_name, params: history.state.params};
   }



   /**
    * Handles routing when user enter the application
    * @author Guilherme Reginaldo Ruella
    */
   function onUserEnter(){

      // *Checking if current page exists and if it has an history entry:
      if(history.state && pageExists(history.state.page_name)){
         // *If it exists:
         // *Loading it:
         loadPage();
      } else{
         // *If not (The user may be hard typing the url):
         // *Getting only the first part of the path:
         let match = /[^/]\S*?[^/]*/gi.exec(window.location.pathname);
         var page_name = match?match[0]:'';

         // *Checking if it exists:
         if(pageExists(page_name)){
            // *If exists, navigate to it:
            navigateTo(page_name);
         } else{
            // *If it not:
            // *Navigating to fallback page:
            navigateTo();
         }
      }
   }



   // *When user go back on browser's history:
   window.addEventListener('popstate', onUserEnter);



   // *When the DOM finished to load:
   $(() => {
      // *Changing spa status to loaded:
      spa_loaded = true;

      // *Hiding all the pages:
      for(page of pages) {
         page.getDOM().hide();
      }

      // *Resolving new access:
      onUserEnter();

      // *Calling all 'ready' event listeners:
      ready_event.resolveAll(f => f());
   });



   // *Exporting SPA module functions:
   return {
      subscribe: subscribe,
      navigateTo: navigateTo,
      onNavigate: onNavigate,
      onUnload: onUnload,
      onReady: onReady,
      setFallbackPage: setFallbackPage,
      getPages: getPages,
      getCurrentState: getCurrentState
   }
})();



spa.subscribe(new Page(''));
spa.subscribe(new Page('vehicle-info'));
spa.subscribe(new Page('login'));
spa.subscribe(new Page('fallback'));
spa.subscribe(new Page('auth'));

spa.setFallbackPage('fallback');

spa.onReady(() => {
   console.log('SPA ready');
});
