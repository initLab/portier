import * as mqtt from 'mqtt';
import { config } from './config.js';

export const client = mqtt.connect(config.mqtt.brokerUrl, config.mqtt?.opts || {});

client.on('connect', function() {
    console.log('MQTT connected');
});

client.on('message', function(topic, payload, packet) {
    console.log(topic, {
        ...packet,
        payload: payload.toString(),
    });
});

client.subscribe('NetControl/#');
