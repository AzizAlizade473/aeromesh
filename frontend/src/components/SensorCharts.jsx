import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, ReferenceLine, Area, AreaChart, ResponsiveContainer, Tooltip } from 'recharts';
import useFleetData from '../hooks/useFleetData';

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
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h3
              className="chart-title"
              style={{ margin: 0, fontSize: '1rem', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600 }}
            >
              Real-time NOₓ Differential
            </h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-mono)' }}>FLEET AGGREGATE (µg/m³)</span>
          </div>
          <div className="nox-chart-legend" style={{ display: 'flex', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 10, height: 10, background: '#EF4444', borderRadius: '2px' }}/>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-mono)' }}>UPSTREAM</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: 10, height: 10, background: '#4ADE80', borderRadius: '2px' }}/>
              <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-mono)' }}>DOWNSTREAM</span>
            </div>
          </div>
        </div>
        
        <div style={{ flex: 1, minHeight: 0 }}>
          <div className="nox-chart-wrapper">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={historicalData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="time" stroke="rgba(255,255,255,0.3)" fontSize={10} tickMargin={8} minTickGap={30} />
              <YAxis
                domain={[0, 250]}
                tick={{ fontSize: 8, fill: 'rgba(255,255,255,0.4)', fontFamily: 'monospace' }}
                tickLine={false}
                axisLine={false}
                tickCount={4}
                tickFormatter={v => `${v}`}
                width={28}
              />
              <Tooltip 
                contentStyle={{ background: '#1A2332', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', color: 'white' }}
                itemStyle={{ fontFamily: 'var(--font-mono)', fontSize: '12px' }}
                labelStyle={{ color: 'var(--text-on-dark-muted)', marginBottom: '4px', fontSize: '10px' }}
              />
              <ReferenceLine
                y={25}
                stroke="#FFC107"
                strokeDasharray="4 3"
                strokeWidth={1}
                label={{ value: 'WHO', position: 'insideTopRight', fontSize: 7, fill: '#FFC107', fontFamily: 'monospace' }}
              />
              <Line type="monotone" dataKey="upstream" stroke="#EF4444" strokeWidth={2} dot={false} isAnimationActive={false} />
              <Line type="monotone" dataKey="downstream" stroke="#4ADE80" strokeWidth={2} dot={false} isAnimationActive={false} />
              </LineChart>
            </ResponsiveContainer>
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
