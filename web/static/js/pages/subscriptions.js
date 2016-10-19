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

// *Setting the fallback page:
spa.setFallbackPage('fallback');
