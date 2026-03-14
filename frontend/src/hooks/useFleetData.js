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
        // Simulated fallback with capacity increment — normalize to snake_case like backend
        const buses = simulatedRef.current.map((bus) => {
          const newPct = bus.filterPct + 0.05;
          bus.filterPct = newPct >= 100 ? 0 : newPct;

          // Add small gaussian noise to NOₓ readings for realism
          const upNoise = (Math.random() - 0.5) * 6;
          const downNoise = (Math.random() - 0.5) * 3;
          const upstream = Math.max(10, (bus.upstreamNox || 100) + upNoise);
          const downstream = Math.max(2, (bus.downstreamNox || 18) + downNoise);

          return {
            ...bus,
            // Emit snake_case keys so SensorCharts, BakuMap, Hero, etc. all work
            upstream_nox: parseFloat(upstream.toFixed(1)),
            downstream_nox: parseFloat(downstream.toFixed(1)),
            filter_pct: parseFloat(bus.filterPct.toFixed(2)),
            nox_captured_grams: parseFloat(((upstream - downstream) * 0.012).toFixed(3)),
          };
        });
        simulatedRef.current = buses;

        setFleet({
          buses,
          active_count: buses.filter((b) => b.status === 'active').length,
          regen_count: buses.filter((b) => b.status === 'regen').length,
          critical_count: buses.filter((b) => b.status === 'critical').length,
          total_nox_captured_grams: buses.reduce(
            (sum, b) => sum + (b.upstream_nox - b.downstream_nox) * 0.012,
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
