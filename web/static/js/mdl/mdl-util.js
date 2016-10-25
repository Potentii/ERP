/**
 * MDL utilities module
 */
const mdl_util = (function(){



   /**
    * Clears out the invalid state from Textfields inside the given container
    * @param  {string} container_id The container HTML id
    * @author Guilherme Reginaldo Ruella
    */
   function clearTextFieldsValidity(container_id){
      $(container_id + ' .mdl-js-textfield').removeClass('is-invalid');
   }



   /**
    * Updates the visual state of MDL Textfields inside the given container
    * @param  {string} container_id The container HTML id
    * @author Guilherme Reginaldo Ruella
    */
   function updateTextFields(container_id){
      // *Getting all MDL elements inside the given container:
      let mdl_elements = document.querySelectorAll(container_id + ' .mdl-js-textfield');
      // *Updating the states of each MDL element:
      for(mdl_element of mdl_elements){
         // *Updating the status:
         mdl_element.MaterialTextfield.updateClasses_();
      }
   }



   /**
    * Updates the visual state of MDL Checkboxes inside the given container
    * @param  {string} container_id The container HTML id
    * @author Guilherme Reginaldo Ruella
    */
   function updateCheckBoxes(container_id){
      // *Getting all MDL elements inside the given container:
      let mdl_elements = document.querySelectorAll(container_id + ' .mdl-js-checkbox');
      // *Updating the states of each MDL element:
      for(mdl_element of mdl_elements){
         // *Updating the status:
         mdl_element.MaterialCheckbox.updateClasses_();
      }
   }



   // *Exporting the module:
   return {
      clearTextFieldsValidity: clearTextFieldsValidity,
      updateTextFields: updateTextFields,
      updateCheckBoxes: updateCheckBoxes
   };
})();
