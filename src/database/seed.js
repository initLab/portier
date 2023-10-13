import { createDebug } from '../debug.js';
import { createOrUpdateApplication } from './api.js';

const debug = createDebug('database:seed');

export async function seed() {
    debug('Started');

    // 7
    await createOrUpdateApplication({
        id: 'c7448514659204d98af889c31e3c2aa44a5b804b6bee0a4f83c075628e111f03',
        name: 'Slackware\'s Test App',
    });

    // 8
    await createOrUpdateApplication({
        id: 'cf012aa1323861ad6a880b1035de55a83b8831ccdf7998a44829c48298feca61',
        name: 'init Lab Telegram bot',
    });

    // 12
    await createOrUpdateApplication({
        id: '10453fb7d0b83fddf04741508e99527c8b76c7400ad10a8d41b5b1812f4ee7e3',
        name: 'initLabNotifier IRC bot',
    });

    // 13
    await createOrUpdateApplication({
        id: 'e9ded1a4356da60400d1675f974e11f199cf6dd0c80d4803019a053828cda108',
        name: 'test IRC bot',
    });

    // 14
    await createOrUpdateApplication({
        id: 'bz-SAIxKZJYa4uk3h61dTIvENi29D-tNsyiy1whM7Qw',
        name: 'Test Telegram bot',
    });

    // 15
    await createOrUpdateApplication({
        id: 'Pt3U_LKKb8RZo0ia9WQzFYHyZGPsSgddon0uZzRfSZs',
        name: 'KaiOS Fauna App',
    });

    // 17: test2

    // 19
    await createOrUpdateApplication({
        id: 'ERBrlPWjf98L_nI8Moxr7Aqjy4no1eRU-zSOROc2RbU',
        name: 'Fauna frontend GitHub Pages',
    });

    // 21: test pkce

    // 22
    await createOrUpdateApplication({
        id: 'oemXGpDnePKlHgLIjthUzFfADrOHyD4FxVwQXF2tyqU',
        name: 'Fauna frontend local',
    });

    // 23
    await createOrUpdateApplication({
        id: 'YueB6ct6SKPN8Ar72G0LC1QFxW9meUDQIOHdAu5mfCE',
        name: 'init Lab Access control',
    });

    // 24
    await createOrUpdateApplication({
        id: 'un1Qlah86-B4PheVNtPytr2nJaEOTxEQHNC0Sv2a2_8',
        name: 'Test phone auth',
    });

    // 25
    await createOrUpdateApplication({
        id: 'Hgiu11obTwKw0r3kO5EE3d3jMp-e9AJDAriH3cSKkTA',
        name: 'ivr',
    });

    debug('Finished');
}
