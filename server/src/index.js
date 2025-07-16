import "./env";
import "dotenv/config";
import BP from "body-parser";
import cors from "cors";
import express from "express";
import { routes } from "./app/routes";
import { env } from "./env";
import { db } from "./lib/db";
import { initiateErrorHandler, logger } from "./lib/helpers";

const app = express();

db.connect();

app.use(BP.json());
app.use(BP.urlencoded({ extended: true }));

app.use(
    cors({
        origin: env.FRONTEND_URL,
        credentials: true,
    })
);

app.use("/api", routes.api);

app.listen(env.PORT, () => {
    initiateErrorHandler();
    logger.info(`Server running on http://localhost:${env.PORT}`);
});
