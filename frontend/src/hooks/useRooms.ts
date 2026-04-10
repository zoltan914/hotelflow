import { useEffect, useState } from "react";
import type { Room } from "../interfaces/interfaces";
import { getAllRooms } from "../services/api";

export function useRooms() {
    const [rooms, setRooms] = useState<Room[]>([]);
    useEffect(() => { 
        const fetchData = async () => {
            const allRoomsRes = await getAllRooms()
            setRooms(allRoomsRes.data)
        }
        fetchData()
    }, []);
    return rooms;
}
