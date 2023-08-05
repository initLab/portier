import * as mqtt from 'mqtt';
import { config } from './config.js';
import { createDebug } from './debug.js';

const debug = createDebug('mqtt');

export const client = mqtt.connect(config.mqtt.brokerUrl, config.mqtt?.opts || {});

client.on('connect', function() {
    debug('Connected');
});

client.on('message', function(topic, payload) {
    debug('message', topic, payload.toString());
});

client.subscribe('NetControl/#');
