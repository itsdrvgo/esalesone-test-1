import { db } from "../src/lib/db/index.js";

/**
 * Migration script to update product schema fields
 * Run this after deploying the new schema to migrate existing data
 */
async function migrateProductSchema() {
    try {
        console.log("Starting product schema migration...");

        // Get all products with old schema
        const products = await db.products.find({
            $or: [
                { product_id: { $exists: true } },
                { totalRevenue: { $exists: true } },
                { totalOrders: { $exists: true } },
                { cost: { $exists: true } },
                { price: { $exists: true } },
                { sku: { $exists: true } },
            ],
        });

        console.log(`Found ${products.length} products to migrate`);

        let migratedCount = 0;
        let errorCount = 0;

        for (const product of products) {
            try {
                const updateFields = {};
                const unsetFields = {};

                // Map old fields to new fields
                if (product.product_id) {
                    updateFields.productId = product.product_id;
                    unsetFields.product_id = "";
                }

                if (product.totalRevenue !== undefined) {
                    updateFields.grossRevenue = product.totalRevenue || 0;
                    unsetFields.totalRevenue = "";
                }

                if (product.totalOrders !== undefined) {
                    updateFields.orderNo = product.totalOrders || 0;
                    unsetFields.totalOrders = "";
                }

                // Calculate expense as 27% of gross revenue (12% + 15%)
                if (product.totalRevenue !== undefined) {
                    const grossRevenue = product.totalRevenue || 0;
                    updateFields.expense =
                        Math.round(grossRevenue * 0.27 * 100) / 100;
                }

                // Set default values for new fields
                updateFields.refunds = 0;

                // Calculate profit and loss
                const grossRevenue =
                    updateFields.grossRevenue || product.totalRevenue || 0;
                const expense = updateFields.expense || 0;
                const refunds = updateFields.refunds || 0;
                const profitAndLoss = grossRevenue - expense - refunds;

                updateFields.profitAndLoss =
                    Math.round(profitAndLoss * 100) / 100;

                // Calculate profit and loss per unit
                const orderNo =
                    updateFields.orderNo || product.totalOrders || 0;
                updateFields.profitAndLossPerUnit =
                    orderNo > 0
                        ? Math.round((profitAndLoss / orderNo) * 100) / 100
                        : 0;

                // Remove old fields
                const fieldsToUnset = [
                    "product_id",
                    "sku",
                    "category_id",
                    "cost",
                    "price",
                    "totalRevenue",
                    "totalOrders",
                    "totalQuantitySold",
                    "profitMargin",
                    "averageOrderValue",
                    "lastUpdated",
                    "isActive",
                ];

                fieldsToUnset.forEach((field) => {
                    if (product[field] !== undefined) {
                        unsetFields[field] = "";
                    }
                });

                // Perform the update
                const updateOperation = {};
                if (Object.keys(updateFields).length > 0) {
                    updateOperation.$set = updateFields;
                }
                if (Object.keys(unsetFields).length > 0) {
                    updateOperation.$unset = unsetFields;
                }

                if (Object.keys(updateOperation).length > 0) {
                    await db.products.updateOne(
                        { _id: product._id },
                        updateOperation
                    );
                    migratedCount++;
                    console.log(
                        `Migrated product: ${product.name || product.product_id || "Unknown"}`
                    );
                }
            } catch (error) {
                console.error(
                    `Error migrating product ${product._id}:`,
                    error.message
                );
                errorCount++;
            }
        }

        console.log(
            `Migration completed: ${migratedCount} successful, ${errorCount} errors`
        );
    } catch (error) {
        console.error("Migration failed:", error.message);
    }
}

// Export for programmatic use
export { migrateProductSchema };

// Run migration if called directly
if (import.meta.main) {
    migrateProductSchema()
        .then(() => {
            console.log("Migration finished");
            process.exit(0);
        })
        .catch((error) => {
            console.error("Migration failed:", error);
            process.exit(1);
        });
}
