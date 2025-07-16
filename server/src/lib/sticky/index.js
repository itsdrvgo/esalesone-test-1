import { TARGET_PRODUCTS } from "@/config/const";
import { axios } from "../axios";

class Sticky {
    constructor() {
        // Cache for product information to avoid repeated API calls
        this._productsCache = null;
        this._productsCacheExpiry = null;
        this._productsCacheTimeout = 5 * 60 * 1000; // 5 minutes
    }

    /**
     * Get cached products or fetch fresh data if cache is expired
     * @returns {Promise<Object>} Products information
     */
    async getCachedProducts() {
        const now = Date.now();

        // Return cached data if it's still valid
        if (
            this._productsCache &&
            this._productsCacheExpiry &&
            now < this._productsCacheExpiry
        ) {
            console.log("Using cached product information");
            return this._productsCache;
        }

        // Fetch fresh product data
        try {
            console.log("Fetching fresh product information");
            this._productsCache = await this.fetchProducts();
            this._productsCacheExpiry = now + this._productsCacheTimeout;
            return this._productsCache;
        } catch (error) {
            console.warn("Failed to fetch product info:", error.message);
            // Return cached data even if expired, or empty object
            return this._productsCache || {};
        }
    }

    async fetchProducts() {
        const response = await axios.post("/product_index", {
            product_id: TARGET_PRODUCTS,
        });

        if (response.data.response_code !== "100")
            throw new Error(
                `API Error: ${response.data.response_code} - ${response.data.message || "Unknown error"}`
            );

        const products = response.data.products || {};
        console.log(
            "fetchProducts - Available product IDs:",
            Object.keys(products)
        );
        console.log("fetchProducts - TARGET_PRODUCTS:", TARGET_PRODUCTS);

        // Log a sample product for structure verification
        const firstProductId = Object.keys(products)[0];
        if (firstProductId) {
            console.log(
                "fetchProducts - Sample product structure:",
                JSON.stringify(products[firstProductId], null, 2)
            );
        }

        return products;
    }

    /**
     * Fetch product revenue and order data
     * @param {string} productId
     */
    async fetchProductFinancials(productId) {
        const endDate = new Date("2025-07-15");
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 3); // Get last 3 days data

        const formatDate = (date) => {
            const month = String(date.getMonth() + 1).padStart(2, "0");
            const day = String(date.getDate()).padStart(2, "0");
            const year = date.getFullYear();
            return `${month}/${day}/${year}`;
        };

        const dateRange = {
            start: formatDate(startDate),
            end: formatDate(endDate),
        };

        const requestData = {
            campaign_id: "all",
            start_date: dateRange.start,
            end_date: dateRange.end,
            product_id: [productId],
            criteria: "all",
            search_type: "all",
        };

        const response = await axios.post("/order_find", requestData);

        if (response.data.response_code !== "100")
            return {
                orderNo: 0,
                orderIds: [],
                dateRange,
            };

        const orderIds = response.data.order_id || [];
        const orderNo = parseInt(response.data.total_orders || 0);

        // Fetch order details to calculate financials
        let grossRevenue = 0;
        let expense = 0;
        let refunds = 0;

        if (orderIds.length > 0) {
            const orderDetails = await this.fetchOrderFinancials(orderIds);
            grossRevenue = orderDetails.grossRevenue;
            expense = orderDetails.expense;
            refunds = orderDetails.refunds;
        }

        const profitAndLoss = grossRevenue - expense - refunds;
        const profitAndLossPerUnit = orderNo > 0 ? profitAndLoss / orderNo : 0;

        return {
            orderNo,
            grossRevenue: Math.round(grossRevenue * 100) / 100,
            expense: Math.round(expense * 100) / 100,
            refunds: Math.round(refunds * 100) / 100,
            profitAndLoss: Math.round(profitAndLoss * 100) / 100,
            profitAndLossPerUnit: Math.round(profitAndLossPerUnit * 100) / 100,
            dateRange,
        };
    }

    /**
     * Fetch financial details for orders
     * @param {string[]} orderIds
     */
    async fetchOrderFinancials(orderIds) {
        if (orderIds.length === 0) {
            return {
                grossRevenue: 0,
                expense: 0,
                refunds: 0,
            };
        }

        console.log(`Fetching financial details for ${orderIds.length} orders`);

        const orderIdInts = orderIds.map((id) => parseInt(id));

        try {
            const response = await axios.post("/order_view", {
                order_id: orderIdInts,
            });

            if (response.data.response_code !== "100") {
                console.warn(
                    "Failed to fetch order details:",
                    response.data.message
                );
                return {
                    grossRevenue: 0,
                    expense: 0,
                    refunds: 0,
                };
            }

            const ordersData = response.data.data || {};
            let grossRevenue = 0;
            let expense = 0;
            let refunds = 0;

            // Iterate through each order in the data object
            Object.values(ordersData).forEach((order) => {
                if (order && typeof order === "object") {
                    // Calculate gross revenue from order_total
                    const orderTotal = parseFloat(order.order_total || 0);
                    grossRevenue += orderTotal;

                    // Calculate expenses (12% transaction fee + 15% other expenses)
                    const transactionFee = orderTotal * 0.12;
                    const otherExpenses = orderTotal * 0.15;
                    expense += transactionFee + otherExpenses;

                    // Check for refunds using multiple possible indicators
                    const isRefunded =
                        order.is_refund === "yes" ||
                        order.is_void === "yes" ||
                        parseFloat(order.amount_refunded_to_date || 0) > 0;

                    if (isRefunded) {
                        // Use amount_refunded_to_date if available, otherwise use order_total
                        const refundAmount = parseFloat(
                            order.amount_refunded_to_date ||
                                order.order_total ||
                                0
                        );
                        refunds += refundAmount;
                    }
                }
            });

            return {
                grossRevenue,
                expense,
                refunds,
            };
        } catch (error) {
            console.error("Error fetching order financials:", error.message);
            return {
                grossRevenue: 0,
                expense: 0,
                refunds: 0,
            };
        }
    }

    /**
     * Clear the products cache
     */
    clearProductsCache() {
        this._productsCache = null;
        this._productsCacheExpiry = null;
        console.log("Products cache cleared");
    }
}

export const sticky = new Sticky();
