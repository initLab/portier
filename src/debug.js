import factory from 'debug';

const debug = factory('app');

export function createDebug(namespace) {
    return debug.extend(namespace, namespace === '' ? '' : undefined);
}
