import passport from 'passport';
import { ZitadelIntrospectionStrategy } from 'passport-zitadel';
import { config } from './config.js';

// Register the strategy with the correct configuration.
passport.use(new ZitadelIntrospectionStrategy(config.passport));

export const middleware = () => passport.authenticate('zitadel-introspection', {
    session: false,
});
