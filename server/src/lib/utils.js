import { MongooseError } from "mongoose";
import { AppError, logger } from "./helpers";

/**
 * @param {unknown} err
 */
export function sanitizeError(err) {
    if (err instanceof AppError) return err.message;
    else if (err instanceof MongooseError) return err.message;
    else if (err instanceof Error) return err.message;
    else return "Unknown error";
}

/**
 * @param {unknown} err
 * @param {import("express").Response} res
 */
export function handleError(err, res) {
    logger.error(err);

    if (err instanceof AppError)
        return CResponse({
            res,
            message: err.status,
            longMessage: sanitizeError(err),
        });
    else if (err instanceof MongooseError)
        return CResponse({
            res,
            message: "ERROR",
            longMessage: sanitizeError(err),
        });
    else if (err instanceof Error)
        return CResponse({
            res,
            message: "ERROR",
            longMessage: sanitizeError(err),
        });
    else
        return CResponse({
            res,
            message: "INTERNAL_SERVER_ERROR",
            longMessage: sanitizeError(err),
        });
}

/**
 * @param {Object} options
 * @param {import("express").Response} options.res
 * @param {import("zod").z.infer<typeof import("./validations/index.js").responseMessages>} [options.message]
 * @param {string} [options.longMessage]
 * @param {any} [options.data]
 */
export function CResponse({ res, message = "OK", longMessage, data }) {
    let code;
    let success = false;

    switch (message) {
        case "OK":
            code = 200;
            success = true;
            break;
        case "ERROR":
            code = 400;
            break;
        case "UNAUTHORIZED":
            code = 401;
            break;
        case "CONFLICT":
            code = 409;
            break;
        case "FORBIDDEN":
            code = 403;
            break;
        case "NOT_FOUND":
            code = 404;
            break;
        case "BAD_REQUEST":
            code = 400;
            break;
        case "TOO_MANY_REQUESTS":
            code = 429;
            break;
        case "INTERNAL_SERVER_ERROR":
            code = 500;
            break;
        case "SERVICE_UNAVAILABLE":
            code = 503;
            break;
        case "GATEWAY_TIMEOUT":
            code = 504;
            break;
        case "UNKNOWN_ERROR":
            code = 500;
            break;
        case "UNPROCESSABLE_ENTITY":
            code = 422;
            break;
        case "NOT_IMPLEMENTED":
            code = 501;
            break;
        case "CREATED":
            code = 201;
            success = true;
            break;
        case "BAD_GATEWAY":
            code = 502;
            break;
        default:
            code = 500;
            break;
    }

    return res.status(code).json({
        success,
        message,
        longMessage,
        data,
    });
}

export function generateDbUrl() {
    const { DB_PROTOCOL, DB_USERNAME, DB_PASSWORD, DB_HOST, DB_NAME } =
        process.env;
    return `${DB_PROTOCOL}://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}`;
}

/**
 * @param {string} text
 * @param {string} separator
 */
export function slugify(text, separator = "-") {
    return text
        .toString()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9 ]/g, "")
        .replace(/\s+/g, separator);
}
