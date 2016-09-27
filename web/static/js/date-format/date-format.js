
/**
 * Module that transforms dates into strings formats
 * @namespace DF
 */
var df = (function(){



   /**
    * Pads the values below ten with a leading zero
    * @param  {number} v         The value to pad
    * @return {string|number}    The padded value
    * @author Guilherme Reginaldo Ruella
    */
   function pad10(v){
      return v => v<10 ? '0'+v : v;
   }



   /**
    * Formats a date as the MySQL's datetime string format
    * @param  {Date} date  The date to format
    * @return {string}     The formatted date and time
    * @author Guilherme Reginaldo Ruella
    */
   function asMysqlDatetime(date){
      // *Getting the date:
      let Y = date.getFullYear();
      let M = pad10(date.getMonth()+1);
      let D = pad10(date.getDate());

      // *Getting the time:
      let h = pad10(date.getHours());
      let m = pad10(date.getMinutes());
      let s = pad10(date.getSeconds());

      // *Returning the string:
      return `${Y}-${M}-${D} ${h}:${m}:${s}`;
   }



   /**
    * Formats a date as the MySQL's datetime string format (only the date part)
    * @param  {Date} date  The date to format
    * @return {string}     The formatted date
    * @author Guilherme Reginaldo Ruella
    */
   function asMysqlDate(date){
      // *Getting the date:
      let Y = date.getFullYear();
      let M = pad10(date.getMonth()+1);
      let D = pad10(date.getDate());

      // *Returning the string:
      return `${Y}-${M}-${D}`;
   }



   /**
    * Formats a date as DD/MM string
    * @param  {Date} date  The date to format
    * @return {string}     The formatted date
    * @author Guilherme Reginaldo Ruella
    */
   function asShortDate(date){
      // *Getting the date:
      let M = pad10(date.getMonth()+1);
      let D = pad10(date.getDate());

      // *Returning the string:
      return `${D}/${M}`;
   }



   // *Exporting this module:
   return {
      asMysqlDatetime: asMysqlDatetime,
      asMysqlDate: asMysqlDate,
      asShortDate: asShortDate
   };
})();