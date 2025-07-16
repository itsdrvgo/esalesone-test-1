"use client";

import { useProduct } from "@/lib/react-query/product";
import { AnalyticsCards } from "./analytics-cards";
import { ProductsTable } from "./products-table";
import { SyncButton } from "./sync-button";

export function ProductAnalytics() {
    const { useAnalytics, useProducts, useSyncProducts } = useProduct();

    const {
        data: analyticsData,
        isLoading: analyticsLoading,
        error: analyticsError,
    } = useAnalytics();

    const {
        data: productsData,
        isLoading: productsLoading,
        error: productsError,
    } = useProducts();

    const { mutateAsync: syncProducts, isPending: syncLoading } =
        useSyncProducts();

    return (
        <div className="container mx-auto py-8 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">
                        Product Analytics
                    </h1>
                    <p className="text-muted-foreground">
                        Monitor your product performance and revenue metrics
                    </p>
                </div>
                <SyncButton onSync={syncProducts} isLoading={syncLoading} />
            </div>

            <AnalyticsCards
                data={analyticsData}
                isLoading={analyticsLoading}
                error={analyticsError}
            />

            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">
                    Products
                </h2>
                <ProductsTable
                    data={productsData}
                    isLoading={productsLoading}
                    error={productsError}
                />
            </div>
        </div>
    );
}
