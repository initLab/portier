export function wrap(middlewareHandler) {
    return async function(req, res, next) {
        try {
            await middlewareHandler(req, res, next);
        }
        catch (e) {
            next(e);
        }
    };
}
