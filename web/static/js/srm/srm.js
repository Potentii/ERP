

/**
 * Exposes the String Resource Management module
 * @namespace SRM
 */
const srm = (function(){
   let dictionary = new Map([]);
   let dictionary_change_event = new HandledEvent();



   /**
    * Loads a new dictionary out of a given file
    * @param  {string} file_path The relative file path
    * @author Guilherme Reginaldo Ruella
    */
   function loadDictionary(file_path){
      // *Requesting the dictionary file via ajax:
      jQuery.ajax({
         url: file_path,
         type: 'GET',
         dataType: 'json'
      }).done(dictionary => {
         // *Setting the dictionary:
         setDictionary(dictionary);
      }).fail(xhr => {
         // *Raising a new error:
         throw new Error('Couldn\'t load the dictionary: ' + file_path);
      });
   }



   /**
    * Sets a dictionary as the default one
    * @param {Array} new_dictionary The dictionary (it must be convertible to Map)
    * @author Guilherme Reginaldo Ruella
    */
   function setDictionary(new_dictionary){
      // *Parsing the new dictionary as a Map:
      dictionary = new Map(new_dictionary);

      // *Defining the remaping regex:
      let regex = /(.*)\$\{(.*)\}(.*)/;
      // *Remaping the dicionary:
      for(let resource of dictionary.entries()){
         // *Checking if the value pass the regex test:
         if(regex.test(resource[1])){
            // *If it pass:
            // *Executing the regex over the string value:
            let match = regex.exec(resource[1]);
            // *Remaping the dictionary resource:
            dictionary.set(resource[0], match[1] + dictionary.get(match[2]) + match[3]);
         }
      }

      // *Calling all the 'on dictionary change' event listeners:
      dictionary_change_event.resolveAll(f => f());
   }



   /**
    * Retrieves a string resource, given its key
    * @param  {string} key The string resource's key
    * @return {string}     The found string resource, undefined otherwise
    * @author Guilherme Reginaldo Ruella
    */
   function get(key){
      // *Returning the value for the given key:
      return dictionary.get(key);
   }



   /**
    * Adds a new listener for the 'on dictionary change' event
    * @param  {function|function[]} action The action to be executed
    * @author Guilherme Reginaldo Ruella
    */
   function onDictionaryChange(action){
      // *Adding the listener in the handler:
      dictionary_change_event.addListener(action);
   }



   // *Exporting the module:
   return {
      loadDictionary: loadDictionary,
      setDictionary: setDictionary,
      get: get,
      onDictionaryChange: onDictionaryChange
   };
})();
