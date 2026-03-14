import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import useFleetData from '../hooks/useFleetData';

// Custom tooltip
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div style={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 6, padding: '8px 12px', fontSize: '0.78rem', fontFamily: 'var(--font-mono)' }}>
      <div style={{ color: '#EF5350', fontWeight: 700 }}>↑ {payload[0]?.value?.toFixed(1)} µg/m³ upstream</div>
      <div style={{ color: '#43A047', fontWeight: 700 }}>↓ {payload[1]?.value?.toFixed(1)} µg/m³ downstream</div>
      <div style={{ color: 'var(--text-muted)', marginTop: 4 }}>
        Captured: {((payload[0]?.value - payload[1]?.value) / payload[0]?.value * 100).toFixed(0)}%
      </div>
    </div>
  )
}

export default function SensorCharts() {
  const { fleet } = useFleetData();
  const [historicalData, setHistoricalData] = useState([]);
  const MAX_POINTS = 30;

  useEffect(() => {
    if (!fleet?.buses) return;
    const totalUp = fleet.buses.reduce((sum, b) => sum + (b.upstream_nox ?? 0), 0);
    const totalDown = fleet.buses.reduce((sum, b) => sum + (b.downstream_nox ?? 0), 0);
    const avgUp = parseFloat((totalUp / (fleet.buses.length || 1)).toFixed(1));
    const avgDown = parseFloat((totalDown / (fleet.buses.length || 1)).toFixed(1));
    
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });

    setHistoricalData(prev => {
      const next = [...prev, { time: timeStr, upstream: avgUp, downstream: avgDown, difference: avgUp - avgDown }];
      if (next.length > MAX_POINTS) next.shift();
      return next;
    });
  }, [fleet]);

  if (historicalData.length === 0) {
    return (
      <div style={{ height: '400px', background: 'var(--bg-dark-surface)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(255,255,255,0.1)' }}>
        <span style={{ color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-mono)' }}>WAITING FOR TELEMETRY...</span>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: '100%' }}>
      
      {/* Chart 1: Upstream vs Downstream */}
      <div style={{ background: 'var(--bg-dark-surface)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-on-dark)', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
          Real-Time NOₓ Differential
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#43A047', animation: 'blink 1.5s infinite', display: 'inline-block' }} />
        </div>

        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData} margin={{ top: 5, right: 5, bottom: 0, left: -10 }}>
              <defs>
                <linearGradient id="upstreamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#EF5350" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#EF5350" stopOpacity={0.02} />
                </linearGradient>
                <linearGradient id="downstreamGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#43A047" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#43A047" stopOpacity={0.02} />
                </linearGradient>
              </defs>

              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />

              <XAxis
                dataKey="time"
                hide={true}   // hide X axis labels — too cluttered at 500ms intervals
              />

              <YAxis
                domain={[0, 250]}
                tick={{ fontSize: 9, fill: 'var(--text-on-dark-muted)', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                tickFormatter={v => `${v}`}
                width={32}
              />

              {/* WHO NO2 safe limit */}
              <ReferenceLine
                y={25}
                stroke="#FFC107"
                strokeDasharray="4 3"
                strokeWidth={1}
                label={{ value: 'WHO 25', position: 'insideTopRight', fontSize: 8, fill: '#FFC107', fontFamily: 'monospace' }}
              />

              <Tooltip content={<CustomTooltip />} />

              {/* Upstream — red area */}
              <Area
                type="monotone"
                dataKey="upstream"
                stroke="#EF5350"
                strokeWidth={2}
                fill="url(#upstreamGrad)"
                dot={false}
                isAnimationActive={false}   // IMPORTANT: disable animation for live data
              />

              {/* Downstream — green area */}
              <Area
                type="monotone"
                dataKey="downstream"
                stroke="#43A047"
                strokeWidth={2}
                fill="url(#downstreamGrad)"
                dot={false}
                isAnimationActive={false}   // IMPORTANT: disable animation for live data
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: 16, marginTop: 6, fontSize: '0.72rem', justifyContent: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 3, background: '#EF5350', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-on-dark-muted)' }}>Upstream (city air)</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 12, height: 3, background: '#43A047', borderRadius: 2 }} />
            <span style={{ color: 'var(--text-on-dark-muted)' }}>Downstream (filtered)</span>
          </div>
        </div>
      </div>

      {/* Chart 2: Total Captured */}
      <div style={{ background: 'var(--bg-dark-surface)', borderRadius: 'var(--radius-md)', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', height: '140px', display: 'flex', flexDirection: 'column' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600 }}>Volume Adsorbed</h3>
        <div style={{ flex: 1, minHeight: 0 }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={historicalData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="colorDiff" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1B4F8A" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#1B4F8A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <YAxis stroke="rgba(255,255,255,0.0)" fontSize={0} domain={[0, 'auto']} width={0} />
              <Tooltip 
                contentStyle={{ background: '#1A2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                itemStyle={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#90CAF9' }}
                labelFormatter={() => ''}
              />
              <Area type="monotone" dataKey="difference" stroke="#1B4F8A" fillOpacity={1} fill="url(#colorDiff)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
}
