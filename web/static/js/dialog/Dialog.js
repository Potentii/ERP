
/**
 * Represents a dialog object
 */
class Dialog{
   constructor(name){
      this._name = name;

      this._onOpen = new HandledEvent();
      this._onDismiss = new HandledEvent();
      this._onQuickDismiss = undefined;
   }



   /**
    * Retrieves the dialog's HTML element
    * @return {jQuery}  The HTML element
    * @author Guilherme Reginaldo Ruella
    */
   getDOM(){
      return $('[data-dialog=\'' + this._name + '\']');
   }



   // *Getters and Setters:
   // *Name:
   getName(){
      return this._name;
   }
   setName(name){
      this._name = name;
   }

   // *OnOpen:
   getOnOpen(){
      return this._onOpen;
   }

   // *OnDismiss:
   getOnDismiss(){
      return this._onDismiss;
   }

   // *OnQuickDismiss:
   getOnQuickDismiss(){
      return this._onQuickDismiss;
   }

   setOnQuickDismiss(onQuickDismiss){
      if(typeof(onQuickDismiss) === 'function'){
         this._onQuickDismiss = onQuickDismiss;
      } else{
         this._onQuickDismiss = undefined;
      }
   }
}
