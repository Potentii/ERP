// *Setting up the overlay container:
dialogger.setOverlay('dialog-overlay');

// *Subscribing the default dialogs:
dialogger.subscribe(new Dialog('default-notice'));
dialogger.subscribe(new Dialog('default-consent'));
dialogger.subscribe(new Dialog('default-retry'));

// *Subscribing the dialogs:
dialogger.subscribe(new Dialog('user-picker'));
dialogger.subscribe(new Dialog('vehicle-picker'));
