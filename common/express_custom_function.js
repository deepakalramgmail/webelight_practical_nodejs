module.exports = function (express) {
    global.HTTP_STATUS_CODES = {
        OK: 200, // For send data, message
        CREATED: 201, // Resource Created
        ACCEPTED: 202, // Update, edit, delete request accepted
        NO_BODY: 204, // No content
        PARTIAL_SUCCESS: 206, // Partial content, request success but some part might failed
        NO_MODIFIED: 304, // No Data change
        BAD_REQUEST: 400, // Validation failed
        UNAUTHORIZED: 401, // Access without login
        FORBIDDEN: 403, // Forbidden
        NOT_FOUND: 404, // URL, Route, Page not found
        METHOD_NOT_ALLOWED: 405, // HTTP method
        CONFLICT: 409, // Duplicate, Already identity available
        UNSUPPORTED_TYPE: 415, // Unsupported media type
        LOCKED: 423, // Resource Locked
        ILLEGAL_ACCESS: 451, // Resource restrict by admin/system
        SERVER_ERROR: 500,
        BAD_GATEWAY: 502, // Not able to connect third party service or other service.
        SERVICE_UNAVAILABLE: 503, // Current service not available
        NOT_ACCEPTABLE: 406, // Request is not acceptable as some thing is missing
    };

    express.response.sendSuccess = function (data = {}, customMessage) {
        this.status(global.HTTP_STATUS_CODES.OK).send({
            status: global.HTTP_STATUS_CODES.OK,
            data: data,
            message: customMessage || undefined,
        });
    };

    express.response.sendDuplicate = function (message) {
        this.status(global.HTTP_STATUS_CODES.CONFLICT).send({
            status: global.HTTP_STATUS_CODES.CONFLICT,
            message: message,
        });
    };

    express.response.sendIsExists = function (response) {
        const code = response ? global.HTTP_STATUS_CODES.OK : global.HTTP_STATUS_CODES.NOT_FOUND; // 200 = Resource exists, 404 = Resource does not exit
        this.status(code).send();
    };

    express.response.sendCreated = function (message, data = {}) {
        this.status(global.HTTP_STATUS_CODES.CREATED).json({
            status: global.HTTP_STATUS_CODES.CREATED,
            data: data,
            message: message,
        });
    };

    express.response.sendUpdated = function (message, data = {}) {
        this.status(global.HTTP_STATUS_CODES.ACCEPTED).json({
            status: global.HTTP_STATUS_CODES.ACCEPTED,
            data: data,
            message: message,
        });
    };

    express.response.sendDeleted = function (message) {
        this.status(global.HTTP_STATUS_CODES.ACCEPTED).json({
            status: global.HTTP_STATUS_CODES.ACCEPTED,
            message: message,
        });
    };

    express.response.sendError = function (message) {
        this.status(global.HTTP_STATUS_CODES.SERVER_ERROR).json({
            status: global.HTTP_STATUS_CODES.SERVER_ERROR,
            message: message,
        });
    };

    express.response.sendInvalidRequest = function (message) {
        this.status(global.HTTP_STATUS_CODES.BAD_GATEWAY).json({
            status: global.HTTP_STATUS_CODES.BAD_GATEWAY,
            message: message,
        });
    };

    express.response.sendResourceNotFound = function (message) {
        this.status(global.HTTP_STATUS_CODES.NOT_FOUND).json({
            status: global.HTTP_STATUS_CODES.NOT_FOUND,
            message: message,
        });
    };

    express.response.sendUnAuthorized = function (message) {
        this.status(global.HTTP_STATUS_CODES.UNAUTHORIZED).json({
            status: global.HTTP_STATUS_CODES.UNAUTHORIZED,
            message: message,
        });
    };

    express.response.sendForbidden = function (message) {
        this.status(global.HTTP_STATUS_CODES.FORBIDDEN).json({
            status: global.HTTP_STATUS_CODES.FORBIDDEN,
            message: message,
        });
    };
    
    express.response.sendNotAcceptable = function (data = {}, message) {
        this.status(global.HTTP_STATUS_CODES.FORBIDDEN).send({
            status: global.HTTP_STATUS_CODES.FORBIDDEN,
            data: data,
            message: message || undefined,
        });
    };
};
