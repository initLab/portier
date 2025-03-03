export function middleware() {
    return async function(req, res, next) {
        // TODO
        req.tokenInfo = {
            application: {
                id: 0,
                name: '',
            },
        };

        next();
    };
}
