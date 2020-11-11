const jwt = require('jsonwebtoken');

module.exports = function(options) {
    return function(req, res, next) {
        try {
            const authorization = req.headers.authorization;
            if (!authorization) {
                console.log('Authorization header missing. Denying request.')
                handleUnauthorized(res, options);
                return;
            }

            const bearer = authorization.split(' ');
            if (!bearer || bearer.length != 2) {
                console.log('Bearer header value malformed. Denying request.')
                handleUnauthorized(res, options);
                return;
            }

            token = bearer[1];
            if (!token) {
                console.log('Token not provided. Denying request.')
                handleUnauthorized(res, options);
                return;
            }

            const decoded_token = jwt.verify(token, options.jwtSigningKey);
            req.roles = decoded_token.roles; // These could be null if the user isn't logged in

        } catch(err) {
            console.error(err);
            handleUnauthorized(res, options);
            return;
        }

        next();
    }
};

function handleUnauthorized(res, options) {
    if (options.loginRedirectUrl) {
        res.redirect(options.loginRedirectUrl)
    }
    else {
        res.status(401).json({
            status: 401,
            message: 'UNAUTHORIZED'
        })
    }
}
