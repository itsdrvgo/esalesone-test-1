import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { axios } from "../axios";

export function useProduct() {
    const queryClient = useQueryClient();

    const useAnalytics = () => {
        return useQuery({
            queryKey: ["product", "analytics"],
            queryFn: async () => {
                const response = await axios.get("/products/analytics");
                if (!response.data.success || response.data.longMessage)
                    throw new Error(
                        response.data.longMessage ||
                            "Failed to fetch product analytics"
                    );
                return response.data.data;
            },
        });
    };

    const useProducts = () => {
        return useQuery({
            queryKey: ["products"],
            queryFn: async () => {
                const response = await axios.get("/products");
                if (!response.data.success || response.data.longMessage)
                    throw new Error(
                        response.data.longMessage || "Failed to fetch products"
                    );
                return response.data.data;
            },
        });
    };

    const useSyncProducts = () => {
        return useMutation({
            mutationFn: async () => {
                const response = await axios.post("/products/sync");
                if (!response.data.success || response.data.longMessage)
                    throw new Error(
                        response.data.longMessage || "Failed to sync products"
                    );
                return response.data.data;
            },
            onSuccess: () => {
                // Invalidate and refetch both products and analytics
                queryClient.invalidateQueries({ queryKey: ["products"] });
                queryClient.invalidateQueries({
                    queryKey: ["product", "analytics"],
                });
            },
        });
    };

    return { useAnalytics, useProducts, useSyncProducts };
}
