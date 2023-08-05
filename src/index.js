import { app } from './app.js';
import './mqtt.js';
import { createDebug } from './debug.js';

const debug = createDebug('index');

const port = process.env.PORT || 3000;
app.listen(port, function() {
   debug('Listening on port', port);
});
