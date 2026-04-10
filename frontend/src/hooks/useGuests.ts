import { useEffect, useState } from "react";
import type { Guest } from "../interfaces/interfaces";
import { getAllGuests } from "../services/api";


export function useGuests() {
    const [guests, setGuests] = useState<Guest[]>([]);
    useEffect(() => { 
        const fetchData = async () => {
            const allGuestsRes = await getAllGuests()
            setGuests(allGuestsRes.data)
        }
        fetchData()
    }, []);
    return guests;
}
