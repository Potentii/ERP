

/**
 * Provides some simple but useful animations
 * @namespace {Anim}
 */
const anim = (function(){



   /**
    * Plays an inflation animation, like a baloon
    * @param  {jQUery} element      The element to animate
    * @param  {number} [time]       Optional. A custom animation time
    * @param  {function} [callback] Optional. A custom action to execute when the animation is done
    * @author Guilherme Reginaldo Ruella
    */
   function inflate(element, time, callback){
      playWithCSSAnimation('inflate', element, time, callback);
   }



   /**
   * Plays a fade in animation
   * @param  {jQUery} element      The element to animate
   * @param  {number} [time]       Optional. A custom animation time
   * @param  {function} [callback] Optional. A custom action to execute when the animation is done
   * @author Guilherme Reginaldo Ruella
   */
   function fadeIn(element, time, callback){
      playWithCSSAnimation('fade-in', element, time, callback);
   }



   /**
    * Plays a fade out animation
    * @param  {jQUery} element      The element to animate
    * @param  {number} [time]       Optional. A custom animation time
    * @param  {function} [callback] Optional. A custom action to execute when the animation is done
    * @author Guilherme Reginaldo Ruella
    */
   function fadeOut(element, time, callback){
      playWithCSSAnimation('fade-out', element, time, callback);
   }



   /**
    * Plays a css animation
    * @param  {string}   css_animation_class The css class name that sets up the animation
    * @param  {jQUery} element      The element to animate
    * @param  {number} [time]       Optional. A custom animation time
    * @param  {function} [callback] Optional. A custom action to execute when the animation is done
    * @author Guilherme Reginaldo Ruella
    */
   function playWithCSSAnimation(css_animation_class, element, time, callback){
      // *Checking if the element is a jQUery object, returning if it's not:
      if(!(element instanceof jQuery)) return;

      // *Checking if the element already has the animation class, returning if it has:
      if(element.hasClass(css_animation_class)) return;


      // *Checking if the time is set:
      if(time || time === 0){
         // *If it is:
         // *Adding the animation class to the element, and setting its duration:
         element.addClass(css_animation_class).css('animation-duration', (time/1000) + 's');
      } else{
         // *If it's not:
         // *Adding the animation class to the element, and getting its default duration:
         time = element.addClass(css_animation_class).css('animation-duration');
         // *Parsing the duration property:
         time = Number(time.replace('s', '')) * 1000;
      }


      // *Starting up the animation completion timer:
      setTimeout(() => {
         // *Removing the animation class:
         element.removeClass(css_animation_class);
         // *Checking if some callback function was given, executing it if it was:
         if(typeof(callback) === 'function') callback();
      }, time);
   }



   // *Exporting the module:
   return {
      inflate: inflate,
      fadeIn: fadeIn,
      fadeOut: fadeOut
   };
})();
