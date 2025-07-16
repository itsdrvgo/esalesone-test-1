import { TARGET_PRODUCTS } from "@/config/const";
import { queries } from "@/lib/queries";
import { sticky } from "@/lib/sticky";
import { CResponse, handleError } from "@/lib/utils";

class ProductController {
    /**
     * @param {import("express").Request} _
     * @param {import("express").Response} res
     */
    async scan(_, res) {
        try {
            const data = await queries.product.scan({ ids: TARGET_PRODUCTS });
            return CResponse({
                res,
                data: {
                    products: data,
                    total: data.length,
                },
            });
        } catch (err) {
            return handleError(err, res);
        }
    }

    /**
     * @param {import("express").Request} _
     * @param {import("express").Response} res
     */
    async analytics(_, res) {
        try {
            const products = await queries.product.scan({
                ids: TARGET_PRODUCTS,
            });

            const totalGrossRevenue = products.reduce(
                (sum, product) => sum + product.grossRevenue,
                0
            );
            const totalExpense = products.reduce(
                (sum, product) => sum + product.expense,
                0
            );
            const totalRefunds = products.reduce(
                (sum, product) => sum + product.refunds,
                0
            );
            const totalProfitAndLoss = products.reduce(
                (sum, product) => sum + product.profitAndLoss,
                0
            );
            const totalOrderNo = products.reduce(
                (sum, product) => sum + product.orderNo,
                0
            );

            return CResponse({
                res,
                data: {
                    summary: {
                        totalProducts: products.length,
                        targetProducts: TARGET_PRODUCTS.length,
                        totalGrossRevenue,
                        totalExpense,
                        totalRefunds,
                        totalProfitAndLoss,
                        totalOrderNo,
                        avgProfitPerOrder:
                            totalOrderNo > 0
                                ? (totalProfitAndLoss / totalOrderNo).toFixed(2)
                                : "0.00",
                    },
                    products: products.map((product) => ({
                        productId: product.productId,
                        name: product.name,
                        orderNo: product.orderNo,
                        grossRevenue: product.grossRevenue,
                        expense: product.expense,
                        refunds: product.refunds,
                        profitAndLoss: product.profitAndLoss,
                        profitAndLossPerUnit: product.profitAndLossPerUnit,
                        updatedAt: product.updatedAt,
                    })),
                },
            });
        } catch (err) {
            return handleError(err, res);
        }
    }

    /**
     * @param {import("express").Request} _
     * @param {import("express").Response} res
     */
    async sync(_, res) {
        try {
            const stickyProducts = await sticky.fetchProducts();

            console.log(
                "Fetched products count:",
                Object.keys(stickyProducts).length
            );
            console.log("Fetched product IDs:", Object.keys(stickyProducts));

            let syncedCount = 0;
            let updatedCount = 0;
            let processedProducts = [];
            let skippedCount = 0;

            for (const [productId, productData] of Object.entries(
                stickyProducts
            )) {
                if (!TARGET_PRODUCTS.includes(+productId)) {
                    console.log(
                        `Skipping product ${productId} - not in target list`
                    );
                    skippedCount++;
                    continue;
                }

                console.log(
                    `Processing target product: ${productId} - ${productData.product_name}`
                );

                const financialData =
                    await sticky.fetchProductFinancials(productId);

                const existingProduct = await queries.product.get(productId);

                const updateData = {
                    name: productData.product_name || "Unknown Product",
                    orderNo: financialData.orderNo,
                    grossRevenue: financialData.grossRevenue,
                    expense: financialData.expense,
                    refunds: financialData.refunds,
                    profitAndLoss: financialData.profitAndLoss,
                    profitAndLossPerUnit: financialData.profitAndLossPerUnit,
                };

                console.log(
                    `Update data for product ${productId}:`,
                    updateData
                );

                const product = await queries.product.update(
                    productId,
                    updateData
                );

                console.log(
                    `Database update result for product ${productId}:`,
                    product
                );

                if (!existingProduct) {
                    syncedCount++;
                    console.log(
                        `Created new product: ${productData.product_name}`
                    );
                } else {
                    updatedCount++;
                    console.log(
                        `Updated existing product: ${productData.product_name}`
                    );
                }

                processedProducts.push({
                    id: productId,
                    name: productData.product_name,
                    orderNo: financialData.orderNo,
                    grossRevenue: financialData.grossRevenue,
                    expense: financialData.expense,
                    refunds: financialData.refunds,
                    profitAndLoss: financialData.profitAndLoss,
                    profitAndLossPerUnit: financialData.profitAndLossPerUnit,
                    dateRange: financialData.dateRange,
                });
            }

            const totalProcessed = syncedCount + updatedCount;
            console.log(
                `Sync completed: ${syncedCount} new, ${updatedCount} updated, ${skippedCount} skipped`
            );

            return CResponse({
                res,
                data: {
                    summary: {
                        total: totalProcessed,
                        created: syncedCount,
                        updated: updatedCount,
                        skipped: skippedCount,
                        targetProducts: TARGET_PRODUCTS.length,
                        availableProducts: Object.keys(stickyProducts).length,
                    },
                    products: processedProducts,
                },
            });
        } catch (err) {
            return handleError(err, res);
        }
    }
}

export const productController = new ProductController();
