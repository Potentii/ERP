// *When the page gets loaded:
$(() => {
   // *When the user click one of the navigation buttons:
   $('#drawer > .drawer-navigation > button').on('click', e => {
      // *Dismissing the navigation drawer:
      drawer.dismiss();
   });
});
