import { useState } from "react";

export function usePageControls() {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);

    const showForm = () => { setIsFormOpen(true); setIsFilterBarOpen(false); };
    const showFilterBar = () => { setIsFilterBarOpen(true); setIsFormOpen(false); };
    const clear = () => { setIsFormOpen(false); setIsFilterBarOpen(false); };

    return { isFormOpen, isFilterBarOpen, showForm, showFilterBar, clear };
}