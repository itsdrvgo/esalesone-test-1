import mongoose from "mongoose";
import { logger } from "../helpers";
import { generateDbUrl } from "../utils";
import { products } from "./schemas";

class Database {
    #uri;

    /**
     * @param {string} uri
     */
    constructor(uri) {
        this.#uri = uri;
        this.products = products;
    }

    connect = async () => {
        const connection = await mongoose.connect(this.#uri);
        logger.info(`Connected to database : ${connection.connection.name}`);
    };

    disconnect = async () => {
        await mongoose.disconnect();
        logger.info("Disconnected from database");
    };
}

export const db = new Database(generateDbUrl());
