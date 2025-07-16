import { AxiosError } from "axios";
import { clsx } from "clsx";
import { NextResponse } from "next/server";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { ZodError } from "zod";

export function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function cn(...inputs) {
    return twMerge(clsx(inputs));
}

export function getAbsoluteURL(path = "/") {
    if (process.env.NEXT_PUBLIC_DEPLOYMENT_URL)
        return `https://${process.env.NEXT_PUBLIC_DEPLOYMENT_URL}${path}`;
    else if (process.env.VERCEL_URL)
        return `https://${process.env.VERCEL_URL}${path}`;
    return "http://localhost:3000" + path;
}

export class AppError extends Error {
    /**
     * @param {string} message
     * @param {import("zod").z.infer<typeof import("./validations/index").responseMessages>} status
     */
    constructor(message, status = "BAD_REQUEST") {
        super(message);
        this.name = "AppError";
        this.status = status;
    }
}

/**
 * @param {unknown} error
 * @returns {string}
 */
export function sanitizeError(error) {
    if (error instanceof AppError) return error.message;
    else if (error instanceof AxiosError)
        return (
            error.response?.data?.longMessage ??
            error.response?.data?.message ??
            error.message
        );
    else if (error instanceof ZodError)
        return error.issues.map((x) => x.message).join(", ");
    else if (error instanceof Error) return error.message;
    else return ERROR_MESSAGES.GENERIC;
}

/**
 * @param {unknown} error
 */
export function handleError(error) {
    if (error instanceof AppError)
        return CResponse({
            message: error.status,
            longMessage: sanitizeError(error),
        });
    else if (error instanceof AxiosError)
        return CResponse({
            message: "INTERNAL_SERVER_ERROR",
            longMessage: sanitizeError(error),
        });
    else if (error instanceof ZodError)
        return CResponse({
            message: "BAD_REQUEST",
            longMessage: sanitizeError(error),
        });
    else if (error instanceof Error)
        return CResponse({
            message: "INTERNAL_SERVER_ERROR",
            longMessage: error.message,
        });
    else return CResponse({ message: "INTERNAL_SERVER_ERROR" });
}

/**
 * @param {Object} options
 * @param {import("zod").z.infer<typeof import("./validations/index").responseMessages>} [options.message="OK"]
 * @param {string} [options.longMessage]
 * @param {any} [options.data]
 */
export function CResponse({ message = "OK", longMessage, data } = {}) {
    let code;
    let success = false;

    switch (message) {
        case "OK":
            success = true;
            code = 200;
            break;
        case "CREATED":
            success = true;
            code = 201;
            break;
        case "BAD_REQUEST":
            code = 400;
            break;
        case "ERROR":
            code = 400;
            break;
        case "UNAUTHORIZED":
            code = 401;
            break;
        case "FORBIDDEN":
            code = 403;
            break;
        case "NOT_FOUND":
            code = 404;
            break;
        case "CONFLICT":
            code = 409;
            break;
        case "TOO_MANY_REQUESTS":
            code = 429;
            break;
        case "UNPROCESSABLE_ENTITY":
            code = 422;
            break;
        case "INTERNAL_SERVER_ERROR":
            code = 500;
            break;
        case "UNKNOWN_ERROR":
            code = 500;
            break;
        case "NOT_IMPLEMENTED":
            code = 501;
            break;
        case "BAD_GATEWAY":
            code = 502;
            break;
        case "SERVICE_UNAVAILABLE":
            code = 503;
            break;
        case "GATEWAY_TIMEOUT":
            code = 504;
            break;
        default:
            code = 500;
            break;
    }

    return NextResponse.json(
        { success, longMessage, data },
        { status: code, statusText: message }
    );
}

/**
 * @param {unknown} error
 * @param {string | number} [toastId]
 */
export function handleClientError(error, toastId) {
    return toast.error(sanitizeError(error), { id: toastId });
}

/**
 * @param {string} text
 * @param {string} [separator="-"]
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

/**
 * @param {string} value
 */
export function convertValueToLabel(value) {
    return value
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .split(/[_-\s]/)
        .map((x) => x.charAt(0).toUpperCase() + x.slice(1))
        .join(" ");
}

/**
 * Format currency with dollar symbol and comma separator
 * @param {number} amount
 * @returns {string}
 */
export function formatCurrency(amount) {
    if (typeof amount !== "number" || isNaN(amount)) return "$0.00";
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    }).format(amount);
}

/**
 * Format P&L with color and +/- prefix
 * @param {number} amount
 * @returns {{ formatted: string, className: string }}
 */
export function formatProfitLoss(amount) {
    if (typeof amount !== "number" || isNaN(amount)) {
        return { formatted: "$0.00", className: "text-gray-500" };
    }

    const isPositive = amount >= 0;
    const prefix = isPositive ? "+" : "";
    const className = isPositive ? "text-green-600" : "text-red-600";
    const formatted = `${prefix}${formatCurrency(amount)}`;

    return { formatted, className };
}
