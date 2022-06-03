const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    if (!req.headers['authorization']) return res.status(401).send({error: "Token not set, please set the Authorization header in form of Bearer <token>", code: 401});
    const token = req.headers['authorization'].split(' ')[1]; // Auth Token is in the form of: Bearer <token>
    if (!token) return res.status(401).send({error: "Token not set, please set the Authorization header in form of Bearer <token>", code: 401});

    try {
        const user = jwt.decode(token);
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).send({error: err, code: 500});
    }
};

const isAdmin = (req, res, next) => {
    if (!req?.user) return res.status(401).send({error: "Unauthenticated", code: 401});
    if (req?.user?.isAdmin && req?.user?.acType === 'ADMIN') {
        next();
    } else {
        return res.status(403).send({error: "Not an Admin. Forbidden", code: 403});
    }
};

module.exports = {
    isAdmin,
    isAuthenticated
}