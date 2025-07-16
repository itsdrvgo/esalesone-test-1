import { db } from "../db";

class ProductQuery {
    async scan({ ids }) {
        const data = await db.products
            .find({
                productId: { $in: ids },
            })
            .sort({ grossRevenue: -1 });

        return data;
    }

    async get(id) {
        const product = await db.products.findOne({
            productId: id,
        });
        if (!product) return null;

        return product;
    }

    async update(id, values) {
        const data = await db.products.findOneAndUpdate(
            { productId: id },
            {
                name: values.name || "Unknown Product",
                orderNo: parseInt(values.orderNo || 0),
                grossRevenue:
                    Math.round((values.grossRevenue || 0) * 100) / 100,
                expense: Math.round((values.expense || 0) * 100) / 100,
                refunds: Math.round((values.refunds || 0) * 100) / 100,
                profitAndLoss:
                    Math.round((values.profitAndLoss || 0) * 100) / 100,
                profitAndLossPerUnit:
                    Math.round((values.profitAndLossPerUnit || 0) * 100) / 100,
            },
            {
                upsert: true,
                new: true,
                runValidators: true,
            }
        );

        return data;
    }
}

export const productQueries = new ProductQuery();
