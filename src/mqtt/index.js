import * as mqtt from 'mqtt';
import { config } from '../config.js';
import { createDebug } from '../debug.js';

const debug = createDebug('mqtt');

let client;
const topics = new Set();

export function init() {
    debug('Connecting...');

    client = mqtt.connect(config.mqtt.brokerUrl, config.mqtt?.opts || {});

    client.on('connect', function() {
        debug('Connected');
        const subscriptionTopics = Array.from(topics);
        client.subscribe(subscriptionTopics);
        debug('Subscribed on connect', subscriptionTopics);
    });

    client.on('message', function(topic, payload) {
        debug('Received', topic, payload.toString());
    });
}

export function subscribe(topic) {
    if (client.connected && !topics.has(topic)) {
        client.subscribe(topic);
        debug('Subscribed after connect', topic);
    }

    topics.add(topic);
}

export function addTopicHandler(wantedTopic, callback) {
    client.on('message', function(receivedTopic, payload, message) {
        if (receivedTopic !== wantedTopic) {
            return;
        }

        callback(payload.toString(), payload, message);
    });
}

export async function publish(topic, message) {
    const messageType = typeof message;
    const encodedMessage = messageType === 'string' || (
        messageType === 'object' && message.constructor.name === 'Buffer'
    ) ? message : JSON.stringify(message);

    return new Promise((resolve, reject) => client.publish(topic, encodedMessage, error =>
        error ? reject(error) : resolve()
    ));
}
