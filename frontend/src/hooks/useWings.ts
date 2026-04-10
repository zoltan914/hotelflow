import { useEffect, useState } from "react";
import type { Wing } from "../interfaces/interfaces";
import { getAllWings } from "../services/api";

export function useWings() {
  const [wings, setWings] = useState<Wing[]>([]);
  useEffect(() => { 
    const fetchData = async () => {
        const allWings = await getAllWings()
        setWings(allWings.data)
    }
    fetchData()
  }, []);
  return wings;
}
