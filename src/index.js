import { app } from './app.js';
import { init as initMqtt } from './mqtt/index.js';
import { createDebug } from './debug.js';
import { init as initDoors } from './doors.js';
import { init as initOAuth2 } from './oauth2.js';

const debug = createDebug('index');

initOAuth2();
initMqtt();
initDoors();

const port = process.env.PORT || 3000;
const host = process.env.HOST || undefined;

app.listen({
   port,
   host,
}, function() {
   debug('Listening on port', port);
});
