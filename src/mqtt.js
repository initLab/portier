import * as mqtt from 'mqtt';
import { config } from './config.js';
import { createDebug } from './debug.js';

const debug = createDebug('mqtt');

export let client;
const topics = [];

export function init() {
    debug('Connecting...');

    client = mqtt.connect(config.mqtt.brokerUrl, config.mqtt?.opts || {});

    client.on('connect', function() {
        debug('Connected');
        client.subscribe(topics);
    });

    client.on('message', function(topic, payload) {
        debug('Received', topic, payload.toString());
    });
}

export function subscribe(topic) {
    topics.push(topic);

    if (client.connected) {
        client.subscribe(topic);
    }
}

export function addEventListener(event, callback) {
    client.on(event, callback);
}

export function publish(topic, message) {
    client.publish(topic, message);
}
