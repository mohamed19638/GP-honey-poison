

"use client";
import { useEffect, useState } from "react";
import { getPumps } from "@/services/api";

export function usePumpData() {
  const [pumps, setPumps] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPumps();
        setPumps(data);
      } catch (err) {
        console.error("Error:", err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);

    return () => clearInterval(interval);
  }, []);

  return pumps;
}