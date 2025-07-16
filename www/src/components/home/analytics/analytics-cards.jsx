"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency, formatProfitLoss } from "@/lib/utils";

export function AnalyticsCards({ data, isLoading, error }) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {Array.from({ length: 5 }).map((_, i) => (
                    <Card key={i} className="animate-pulse">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                <div className="h-4 bg-gray-200 rounded w-24"></div>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-8 bg-gray-200 rounded w-16"></div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        );
    }

    if (error) {
        return (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                <Card className="col-span-full">
                    <CardContent className="pt-6">
                        <p className="text-destructive text-sm">
                            Failed to load analytics: {error.message}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (!data || !data.summary) {
        return null;
    }

    const totalProfitLoss = formatProfitLoss(
        data.summary.totalProfitAndLoss || 0
    );
    const avgProfitLossPerUnit = formatProfitLoss(
        parseFloat(data.summary.avgProfitPerOrder) || 0
    );

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Products
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.summary.totalProducts?.toLocaleString() || 0}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Orders
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {data.summary.totalOrderNo?.toLocaleString() || 0}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Gross Revenue
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {formatCurrency(data.summary.totalGrossRevenue || 0)}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Total Profit & Loss
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={`text-2xl font-bold ${totalProfitLoss.className}`}
                    >
                        {totalProfitLoss.formatted}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">
                        Average Profit Per Order
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div
                        className={`text-2xl font-bold ${avgProfitLossPerUnit.className}`}
                    >
                        {avgProfitLossPerUnit.formatted}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
