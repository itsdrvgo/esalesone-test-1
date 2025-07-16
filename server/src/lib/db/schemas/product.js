import { model, Schema } from "mongoose";

const productSchema = new Schema(
    {
        productId: { type: String, required: true, unique: true },
        name: { type: String, required: true },
        orderNo: { type: Number, default: 0 },
        grossRevenue: { type: Number, default: 0 },
        expense: { type: Number, default: 0 },
        refunds: { type: Number, default: 0 },
        profitAndLoss: { type: Number, default: 0 },
        profitAndLossPerUnit: { type: Number, default: 0 },
    },
    {
        timestamps: true,
    }
);

export const products = model("product", productSchema);
