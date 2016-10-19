

/**
 * Module that encode files
 * @namespace FileEncoder
 */
const file_encoder = (function(){



   /**
    * Encodes a file as a Base64 string URL
    * @param  {File} file        The File to encode
    * @param  {function} onReady The encode completion callback
    * @author Guilherme Reginaldo Ruella
    */
   function asBase64(file, onReady){
      // *Creating a new file reader:
      var reader = new FileReader();

      // *When the file encoding gets completed:
      reader.addEventListener('load', () => {
         // *Calling the callback if any, and passing the encoded string:
         if(onReady) onReady(reader.result);
      }, false);

      // *Checking if the file is set:
      if(file){
         // *If it is:
         // *Starting to encode the file:
         reader.readAsDataURL(file);
      }
   }



   // *Exporting the module:
   return {
      asBase64: asBase64
   };
})();
