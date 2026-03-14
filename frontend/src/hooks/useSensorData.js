import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

/**
 * useSensorData — Polls /api/sensors/all every 500ms for live NOₓ readings.
 * Falls back to simulated data on error.
 * @returns {{ readings: Array, loading: boolean, error: string|null }}
 */
export default function useSensorData() {
  const [readings, setReadings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const intervalRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get('/api/sensors/all');
        setReadings(res.data.readings || res.data);
        setError(null);
        setLoading(false);
      } catch {
        // Fall back to simulated data
        setReadings([
          {
            bus_id: 0,
            upstream_nox: 120 + Math.random() * 80,
            downstream_nox: 15 + Math.random() * 25,
            timestamp: new Date().toISOString(),
          },
        ]);
        setError('Using simulated sensor data');
        setLoading(false);
      }
    };

    fetchData();
    intervalRef.current = setInterval(fetchData, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { readings, loading, error };
}
