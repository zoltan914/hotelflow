import { useEffect, useState } from "react";
import type { Staff } from "../interfaces/interfaces";
import { getAllStaff } from "../services/api";



export function useStaff() {
    const [staff, setStaff] = useState<Staff[]>([]);
    useEffect(() => { 
        const fetchData = async () => {
            const allStaffRes = await getAllStaff()
            setStaff(allStaffRes.data)
        }
        fetchData()
    }, []);
    return staff;
}