// *Subscribing all the pages:
spa.subscribe(new Page('fallback'));

spa.subscribe(new Page('login'));
spa.subscribe(new Page('auth'));

spa.subscribe(new Page(''));
spa.subscribe(new Page('vehicle-info'));
spa.subscribe(new Page('vehicle-create'));
spa.subscribe(new Page('vehicle-update'));

spa.subscribe(new Page('schedules'));
spa.subscribe(new Page('schedule-info'));
spa.subscribe(new Page('schedule-create'));
spa.subscribe(new Page('schedule-update'));
spa.subscribe(new Page('reservations'));

spa.subscribe(new Page('users'));
spa.subscribe(new Page('account-info'));
spa.subscribe(new Page('user-info'));
spa.subscribe(new Page('user-create'));
spa.subscribe(new Page('user-update'));

spa.subscribe(new Page('settings'));

// *Setting the fallback page:
spa.setFallbackPage('fallback');
