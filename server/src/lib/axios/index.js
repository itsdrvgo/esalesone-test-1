import { env } from "@/env";
import _axios from "axios";

export const axios = _axios.create({
    baseURL: env.STICKY_BASE_URL,
    auth: {
        username: env.STICKY_USERNAME,
        password: env.STICKY_PASSWORD,
    },
    headers: {
        "Content-Type": "application/json",
    },
    timeout: 60000,
});
