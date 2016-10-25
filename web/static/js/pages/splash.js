// *When the spa system gets ready:
spa.onReady(() => {
   // *Starting the overlaying timer:
   setTimeout(() => {
      // *Fading out the loading overlay:
      anim.fadeOut($('#load-overlay'), undefined, () => {
         // *Hiding the overlay:
         $('#load-overlay').hide();
      });
   }, 10);
});
