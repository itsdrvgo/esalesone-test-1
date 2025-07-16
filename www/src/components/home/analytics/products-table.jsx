"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { formatCurrency, formatProfitLoss } from "@/lib/utils";
import { ChevronDown, ChevronUp, Search } from "lucide-react";
import { useMemo, useState } from "react";

export function ProductsTable({ data, isLoading, error }) {
    const [searchTerm, setSearchTerm] = useState("");
    const [sortConfig, setSortConfig] = useState({
        key: null,
        direction: "asc",
    });

    const handleSort = (key) => {
        let direction = "asc";
        if (sortConfig.key === key && sortConfig.direction === "asc") {
            direction = "desc";
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedData = useMemo(() => {
        if (!data || !data.products) return [];

        // Filter by product name
        let filtered = data.products.filter((product) =>
            product.name?.toLowerCase().includes(searchTerm.toLowerCase())
        );

        // Sort data
        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (aValue === null || aValue === undefined) return 1;
                if (bValue === null || bValue === undefined) return -1;

                if (typeof aValue === "number" && typeof bValue === "number") {
                    return sortConfig.direction === "asc"
                        ? aValue - bValue
                        : bValue - aValue;
                }

                const aStr = String(aValue).toLowerCase();
                const bStr = String(bValue).toLowerCase();

                if (sortConfig.direction === "asc") {
                    return aStr < bStr ? -1 : aStr > bStr ? 1 : 0;
                } else {
                    return aStr > bStr ? -1 : aStr < bStr ? 1 : 0;
                }
            });
        }

        return filtered;
    }, [data, searchTerm, sortConfig]);

    const SortableHeader = ({ children, sortKey }) => (
        <TableHead
            className="cursor-pointer select-none hover:bg-muted/50"
            onClick={() => handleSort(sortKey)}
        >
            <div className="flex items-center justify-between">
                {children}
                <div className="ml-2">
                    {sortConfig.key === sortKey ? (
                        sortConfig.direction === "asc" ? (
                            <ChevronUp className="h-4 w-4" />
                        ) : (
                            <ChevronDown className="h-4 w-4" />
                        )
                    ) : (
                        <div className="h-4 w-4" />
                    )}
                </div>
            </div>
        </TableHead>
    );

    if (isLoading) {
        return (
            <div className="space-y-4">
                <div className="flex items-center space-x-2">
                    <Search className="h-4 w-4 text-muted-foreground" />
                    <div className="h-9 bg-gray-200 rounded w-64 animate-pulse"></div>
                </div>
                <div className="border rounded-md">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {[
                                    "Product ID",
                                    "Product Name",
                                    "Order No.",
                                    "Gross Revenue",
                                    "Txn Fees & Refunds",
                                    "P&L",
                                    "P&L Per Unit",
                                ].map((header) => (
                                    <TableHead key={header}>{header}</TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {Array.from({ length: 5 }).map((_, i) => (
                                <TableRow key={i}>
                                    {Array.from({ length: 7 }).map((_, j) => (
                                        <TableCell key={j}>
                                            <div className="h-4 bg-gray-200 rounded w-full animate-pulse"></div>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="border rounded-md p-8 text-center">
                <p className="text-destructive">
                    Failed to load products: {error.message}
                </p>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center space-x-2">
                <Search className="h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="border rounded-md">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <SortableHeader sortKey="productId">
                                Product ID
                            </SortableHeader>
                            <SortableHeader sortKey="name">
                                Product Name
                            </SortableHeader>
                            <SortableHeader sortKey="orderNo">
                                Order No.
                            </SortableHeader>
                            <SortableHeader sortKey="grossRevenue">
                                Gross Revenue
                            </SortableHeader>
                            <TableHead>Txn Fees & Refunds</TableHead>
                            <SortableHeader sortKey="profitAndLoss">
                                P&L
                            </SortableHeader>
                            <SortableHeader sortKey="profitAndLossPerUnit">
                                P&L Per Unit
                            </SortableHeader>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredAndSortedData.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={7}
                                    className="text-center py-8 text-muted-foreground"
                                >
                                    {searchTerm
                                        ? "No products found matching your search."
                                        : "No products available."}
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredAndSortedData.map((product, index) => {
                                const profitLoss = formatProfitLoss(
                                    product.profitAndLoss || 0
                                );
                                const profitLossPerUnit = formatProfitLoss(
                                    product.profitAndLossPerUnit || 0
                                );

                                // Use the expense value from API (already calculated)
                                const totalExpenses = product.expense || 0;

                                return (
                                    <TableRow
                                        key={product.productId || index}
                                        className="hover:bg-muted/50"
                                    >
                                        <TableCell className="font-medium">
                                            {product.productId || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {product.name || "-"}
                                        </TableCell>
                                        <TableCell>
                                            {product.orderNo?.toLocaleString() ||
                                                "-"}
                                        </TableCell>
                                        <TableCell className="font-medium">
                                            {formatCurrency(
                                                product.grossRevenue || 0
                                            )}
                                        </TableCell>
                                        <TableCell className="text-red-600">
                                            {formatCurrency(totalExpenses)}
                                        </TableCell>
                                        <TableCell
                                            className={`font-medium ${profitLoss.className}`}
                                        >
                                            {profitLoss.formatted}
                                        </TableCell>
                                        <TableCell
                                            className={`font-medium ${profitLossPerUnit.className}`}
                                        >
                                            {profitLossPerUnit.formatted}
                                        </TableCell>
                                    </TableRow>
                                );
                            })
                        )}
                    </TableBody>
                </Table>
            </div>

            {filteredAndSortedData.length > 0 && (
                <div className="text-sm text-muted-foreground">
                    Showing {filteredAndSortedData.length} of{" "}
                    {data?.products?.length || 0} products
                </div>
            )}
        </div>
    );
}
