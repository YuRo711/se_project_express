const { BAD_REQUEST_CODE, NOT_FOUND_CODE, UNAUTHORIZED_CODE, FORBIDDEN_CODE, SERVER_ERROR_CODE, CONFLICT_CODE, SERVER_ERROR_MESSAGE } = require("../utils/errors");

module.exports = (err, req, res, next) => {
    if (err.code === BAD_REQUEST_CODE || err.code === UNAUTHORIZED_CODE ||
            err.code === NOT_FOUND_CODE || err.code === FORBIDDEN_CODE ||
            err.code === CONFLICT_CODE) {
        res.status(err.code).send({ message: err.message });
        console.error(err);
    } else {
        res.status(SERVER_ERROR_CODE).send({ message: SERVER_ERROR_MESSAGE });
        console.error(new Error(SERVER_ERROR_MESSAGE));
    }

    return next();
};
