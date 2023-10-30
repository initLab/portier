import * as mqtt from 'mqtt';
import { config } from '../config.js';
import { createDebug } from '../util/debug.js';

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

function encodeMessage(message) {
    const messageType = typeof message;
    return messageType === 'string' || (
        messageType === 'object' && message.constructor.name === 'Buffer'
    ) ? message : JSON.stringify(message);
}

export function publish(topic, message, opts) {
    const encodedMessage = encodeMessage(message);

    client.publish(topic, encodedMessage, opts, function(error) {
        if (error) {
            throw error;
        }
    });
}
