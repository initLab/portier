import minimist from 'minimist';

export function parseArgs() {
    const argv = minimist(process.argv.slice(2));

    return {
        dbRecreate: argEnabled('db-recreate', argv),
        dbAlter: argEnabled('db-alter', argv),
        dbSeed: argEnabled('db-seed', argv),
        dbOnly: argEnabled('db-only', argv),
    };
}

const argEnabled = (key, args) =>
    process.env?.[key.toUpperCase().replaceAll('-', '_')] === 'true' ||
    args?.[key] === true;
