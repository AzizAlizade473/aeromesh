import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { INITIAL_BUS_DATA } from '../data/busData';

/**
 * useFleetData — Polls /api/fleet every 1000ms.
 * Falls back to INITIAL_BUS_DATA with simulated filter increment on error.
 * @returns {{ fleet: object|null, loading: boolean, error: string|null }}
 */
export default function useFleetData() {
  const [fleet, setFleet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);
  const simulatedRef = useRef(
    INITIAL_BUS_DATA.map((b) => ({ ...b, filterPct: b.filterPct }))
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/fleet');
        setFleet(res.data);
        setError(null);
        setLoading(false);
      } catch {
        // Simulated fallback with capacity increment
        const buses = simulatedRef.current.map((bus) => {
          const newPct = bus.filterPct + 0.05;
          bus.filterPct = newPct >= 100 ? 0 : newPct;
          return { ...bus };
        });
        simulatedRef.current = buses;

        setFleet({
          buses,
          active_count: buses.filter((b) => b.status === 'active').length,
          regen_count: buses.filter((b) => b.status === 'regen').length,
          critical_count: buses.filter((b) => b.status === 'critical').length,
          total_nox_captured_grams: buses.reduce(
            (sum, b) => sum + (b.upstreamNox - b.downstreamNox) * 0.012,
            0
          ),
        });
        setError('Using simulated fleet data');
        setLoading(false);
      }
    };

    fetchData();
    intervalRef.current = setInterval(fetchData, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { fleet, loading, error };
}
