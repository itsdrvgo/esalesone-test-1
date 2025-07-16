// @ts-nocheck
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
    server: {
        FRONTEND_URL: z.string().min(1, "FRONTEND_URL is required"),
        PORT: z.coerce.number().default(3001),

        DB_PROTOCOL: z.string().min(1, "DB_PROTOCOL is required"),
        DB_USERNAME: z.string().min(1, "DB_USERNAME is required"),
        DB_PASSWORD: z.string().min(1, "DB_PASSWORD is required"),
        DB_HOST: z.string().min(1, "DB_HOST is required"),
        DB_NAME: z.string().min(1, "DB_NAME is required"),

        STICKY_BASE_URL: z.string().min(1, "STICKY_BASE_URL is required"),
        STICKY_USERNAME: z.string().min(1, "STICKY_USERNAME is required"),
        STICKY_PASSWORD: z.string().min(1, "STICKY_PASSWORD is required"),
    },
    runtimeEnv: process.env,
});
