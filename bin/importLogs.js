import minimist from 'minimist';
import fs from 'fs/promises';
import { init as initDatabase } from '../src/database/index.js';
import { logDeviceActionInternal } from '../src/device/actionLogger.js';

const DEFAULT_APP_ID = 'YueB6ct6SKPN8Ar72G0LC1QFxW9meUDQIOHdAu5mfCE';

await initDatabase();

const argv = minimist(process.argv.slice(2));
const args = argv._;

for (const arg of args) {
    const file = await fs.open(arg);

    console.log('Importing from file', arg);
    let lines = 0;

    for await (const line of file.readLines()) {
        const topicIndex = line.indexOf(' ');

        if (topicIndex < 0) {
            console.error('Topic index not found in line', line);
            continue;
        }

        const payloadIndex = line.indexOf(' ', topicIndex + 1);

        if (payloadIndex < 0) {
            console.error('Payload index not found in line', line);
            continue;
        }

        // const ts = line.substring(0, topicIndex);
        // const topic = line.substring(topicIndex + 1, payloadIndex);
        const payload = JSON.parse(line.substring(payloadIndex + 1));

        await logDeviceActionInternal(
            payload.user,
            payload?.application || {
                id: DEFAULT_APP_ID,
            },
            payload.device || payload.door,
            payload.action,
            payload.ts,
        );

        lines++;
    }

    console.log(lines, 'lines imported');
}
