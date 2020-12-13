import passport from 'passport';
import {Strategy, ExtractJwt} from 'passport-jwt';

export default app => {
    const Users = app.datasource.models.Users;
    const opts = {};
    opts.secretOrKey = app.config.jwtSecret;
    opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()

    const strategy = new Strategy(opts, (payload, done) => {
        Users.findByPk(payload.id)
        .then(user => {
            if (user) {
                return done(null, {
                    id: user.id,
                    name: user.name,
                    username: user.username
                })
            }
            return done(null, false);
        })

        .catch(error => done(error, null));
    });

    passport.use(strategy);

    return {
        initialize: () => passport.initialize(),
        authenticate: () => passport.authenticate('jwt', app.config.jwtSession)
    }
}