import { app } from './app.js';
import { init as initMqtt } from './mqtt.js';
import { createDebug } from './debug.js';
import { init as initDoors } from './doors.js';

const debug = createDebug('index');

initMqtt();
initDoors();

const port = process.env.PORT || 3000;
app.listen(port, function() {
   debug('Listening on port', port);
});
