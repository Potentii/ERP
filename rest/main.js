// *Requesting electron:
const electron = require('electron');
const { app, BrowserWindow } = electron;

// *Requesting the REST service:
const REST = require('./rest');

/**
 * The main window frame
 * @type BrowserWindow
 */
let win;



/**
 * Creates a new Eiger server window frame
 * @author Guilherme Reginaldo Ruella
 */
function createWindow(){
   // *Setting up the window frame:
   win = new BrowserWindow({
      title: 'Eiger',
      width: 420,
      height: 600
   });


   // *When the window closes:
   win.on('closed', () => {
      // *Removing the window reference:
      win = null;
   });


   // *Removing the default toolbar:
   win.setMenu(null);
   // *Loading the html file:
   win.loadURL('file://' + require('path').resolve(__dirname, './', 'ui/index.html'));
   // *Displaying the window frame:
   win.show();
}


// *When electron is ready:
app.on('ready', () => {
   // *Starting services:
   REST.startServices()
      .then(() => createWindow())
      .catch(err => {
         REST.stopServices()
            .then(() => app.quit())
            .catch(err => {throw err;});
      });
});



// *When all windows get closed:
app.on('window-all-closed', () => {
   // *Checking if the OS is a Macintosh:
   if(process.platform !== 'darwin'){
      // *If it's not:
      // *Requesting REST to end all services before quitting:
      REST.stopServices()
         .then(() => app.quit())
         .catch(err => {throw err;});
   }
});



// *When user re-focus the application:
app.on('activate', () => {
   // *Checking if windows reference is lost:
   if(win === null){
      // *If it is:
      // *Creates the window again:
      createWindow();
   }
});



/**
 * Retrieves the main window frame
 * @return {BrowserWindow}  The window frame
 */
function getWindow(){
   return win;
}


// *Exporting the module:
module.exports = {
   getWindow: getWindow
};
