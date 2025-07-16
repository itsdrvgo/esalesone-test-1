"use client";

import { Button } from "@/components/ui/button";
import { handleClientError } from "@/lib/utils";
import { Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

export function SyncButton({ onSync, isLoading }) {
    const handleSyncClick = async () => {
        try {
            await onSync();
            toast.success("Products synced successfully!");
        } catch (error) {
            handleClientError(error);
        }
    };

    return (
        <Button
            onClick={handleSyncClick}
            disabled={isLoading}
            className="gap-2"
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
                <RefreshCw className="h-4 w-4" />
            )}
            {isLoading ? "Syncing..." : "Sync Products"}
        </Button>
    );
}
