`use strict`;

const { HTTP_STATUS_CODES } = require('../utils/constants');


const handelHTTPEndpointError = (err, res) => {
    if (err.customMessage)
        return res.status(HTTP_STATUS_CODES.INVALID_INPUT).send(err.customMessage);
    return res.status(HTTP_STATUS_CODES.GENERIC_SERVER_ERROR).send('Something Went Wrong');
}

module.exports = {
    handelHTTPEndpointError
}