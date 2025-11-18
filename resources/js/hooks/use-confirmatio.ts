import { ActionButton } from "@/types/datatable";
import { useState } from "react";

export function useConfirmation() {
    const [confirmAction, setConfirmAction] = useState<ActionButton | null>(null);

    const requestConfirmation = (action: ActionButton) => {
        setConfirmAction(action);
    };

    const clearConfirmation = () => {
        setConfirmAction(null);
    };

    return {
        confirmAction,
        requestConfirmation,
        clearConfirmation,
    };
}
