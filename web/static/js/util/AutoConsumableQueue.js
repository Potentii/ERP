class AutoConsumableQueue{
   constructor(consumer){
      this.queue = [];
      this.consumer = consumer;
      this.isConsuming = false;
   }



   /**
    * Adds an item at the end of the queue
    * @param {*} item The item to be added
    * @author Guilherme Reginaldo Ruella
    */
   add(item){
      // *Queueing the item:
      this.queue.push(item);
      // *Checking if it's not consuming items already. If not, start:
      if(!this.isConsuming) this.next();
   }



   /**
    * Consumes the next item on the queue, if any
    * @author Guilherme Reginaldo Ruella
    */
   next(){
      // *Setting the consuming flag:
      this.isConsuming = true;
      // *Getting the next on queue, and removing it:
      let item = this.queue.shift();
      // *Checking if there's some item left:
      if(item){
         // *If there is:
         // *Consuming it:
         this.consumer(item);
      } else{
         // *If not:
         // *Stopping to consume:
         this.isConsuming = false;
      }
   }



   /**
    * Verifies if there is another item left on the queue
    * @return {boolean}  True if there is, false otherwise
    * @author Guilherme Reginaldo Ruella
    */
   hasNext(){
      return this.queue.length?true:false;
   }
}
