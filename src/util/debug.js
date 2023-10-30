import factory from 'debug';
import util from 'node:util';

function logToConsole(...args) {
    return console.log(util.format(...args));
}

if ((process.env.NODE_OPTIONS || '').endsWith('/debugConnector.js')) {
    factory.log = logToConsole;
}

const debug = factory('app');

export function createDebug(namespace) {
    return debug.extend(namespace, namespace === '' ? '' : undefined);
}
