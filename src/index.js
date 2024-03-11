import { app } from './app.js';
import { init as initMqtt } from './mqtt/index.js';
import { createDebug } from './util/debug.js';
import { init as initOAuth2 } from './util/oauth2.js';
import { init as initDatabase } from './database/index.js';
import { parseArgs } from './util/argv.js';
import { init as initStatuses } from './status/index.js';
import { init as initPrometheus } from './prometheus/index.js';

const debug = createDebug('index');

const {
   dbRecreate,
   dbAlter,
   dbSeed,
   dbOnly,
} = parseArgs();

await initDatabase({
   force: dbRecreate,
   alter: dbAlter,
}, dbSeed);

if (dbOnly) {
   debug('DB-only mode selected, not starting application');
   process.exit();
}

debug('Starting');

initPrometheus();
initOAuth2();
initMqtt();
initStatuses();

const port = process.env.PORT || 3000;
const host = process.env.HOST || undefined;

app.listen({
   port,
   host,
}, function() {
   debug('Listening on port', port);
});
