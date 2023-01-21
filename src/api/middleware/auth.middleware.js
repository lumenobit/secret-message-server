const TokenUtil = require("../util/jwt.util");

function validateAuth(req, res, next) {
    const token = req.headers['authorization'];
    const jwt = token?.substr(7);
    const tokenDecoded = jwt && TokenUtil.verify(jwt)
    if (tokenDecoded) {
        req.body.tokenDecoded = tokenDecoded;
        next();
    } else {
        res.status(401).send({ message: "Please login to continue." })
    }
}

module.exports = {
    validateAuth
}