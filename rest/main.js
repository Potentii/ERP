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
      width: 520,
      height: 650
   });


   // *When the window closes:
   win.on('closed', () => {
      // *Removing the window reference:
      win = null;
   });

   // *Setting up all the IPC main channels:
   setupChannels();

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
         console.log(err);
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
 * @author Guilherme Reginaldo Ruella
 */
function getWindow(){
   return win;
}



/**
 * Sets all the IPC main channels
 * @author Guilherme Reginaldo Ruella
 */
function setupChannels(){
   // *Getting the ipc main module:
   const {ipcMain} = require('electron');

   // *Setting up the e-mail settings saving channel:
   ipcMain.on('save-email-settings', (e, content) => {
      // *Getting the settings module:
      const settings = require('./settings/settings');

      // *Saving the given settings into a file:
      settings.saveSettings(settings.EMAIL_SETTINGS_FILE, content)
         .then(() => e.sender.send('save-email-settings-success'))
         .catch(err => e.sender.send('save-email-settings-fail', err));
   });

   // *Setting up the e-mail settings loading channel:
   ipcMain.on('load-email-settings', (e) => {
      // *Getting the settings module:
      const settings = require('./settings/settings');

      // *Retrieving the settings from a file:
      settings.loadSettings(settings.EMAIL_SETTINGS_FILE)
         .then(content => e.sender.send('load-email-settings-success', content))
         .catch(err => e.sender.send('load-email-settings-fail', err));
   });
}



// *Exporting the module:
module.exports = {
   getWindow: getWindow
};
