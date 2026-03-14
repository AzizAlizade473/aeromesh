import { useState, useEffect } from 'react';
import useFleetData from '../hooks/useFleetData';

const BORDER_COLORS = {
  critical: '#C62828',
  warning: '#E65100',
  info: '#1B4F8A',
  ble: '#4ADE80',
};

export default function FleetAlertLog() {
  const { fleet } = useFleetData();
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!fleet?.alerts) return;
    
    const formattedAlerts = fleet.alerts.map(alert => {
      let typeText = 'INFO';
      const typeLower = alert.type.toLowerCase();
      if (typeLower === 'critical') typeText = 'CRITICAL';
      else if (typeLower === 'warning') typeText = 'WARNING';
      else if (typeLower === 'ble') typeText = 'SYNC';

      return {
        id: alert.id || Math.random(),
        time: new Date(alert.timestamp).toLocaleTimeString([], { hour12: false }),
        type: typeLower,
        typeText: typeText,
        busId: alert.bus_id,
        message: alert.message,
      };
    });

    setLogs(prev => {
      const all = [...formattedAlerts, ...prev];
      const unique = Array.from(new Map(all.map(item => [item.id, item])).values());
      return unique.sort((a, b) => b.time.localeCompare(a.time)).slice(0, 50);
    });
  }, [fleet?.alerts]);

  return (
    <div style={{
      background: 'var(--bg-dark-surface)',
      border: '1px solid rgba(255,255,255,0.1)',
      borderRadius: 'var(--radius-md)',
      height: '300px',
      display: 'flex', flexDirection: 'column',
    }}>
      <div style={{
        padding: '12px 20px',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center'
      }}>
        <h3 style={{ margin: 0, fontSize: '1rem', color: 'white', fontFamily: 'var(--font-display)', fontWeight: 600 }}>System Events</h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-mono)' }}>LIVE FEED</span>
      </div>
      
      <div style={{ overflowY: 'auto', flex: 1, padding: '12px' }}>
        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', color: 'var(--text-on-dark-muted)', fontSize: '0.8rem', marginTop: '20px', fontFamily: 'var(--font-mono)' }}>
            No recent events...
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map(log => (
              <div key={log.id} style={{
                background: 'rgba(255,255,255,0.03)',
                borderLeft: `3px solid ${BORDER_COLORS[log.type] || '#1B4F8A'}`,
                padding: '10px 14px',
                borderRadius: '4px',
                display: 'flex',
                gap: '12px',
                alignItems: 'baseline'
              }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-on-dark-muted)', fontFamily: 'var(--font-mono)' }}>[{log.time}]</span>
                <span style={{ 
                  fontSize: '0.65rem', 
                  padding: '2px 6px', 
                  borderRadius: '4px',
                  background: 'rgba(255,255,255,0.1)',
                  color: BORDER_COLORS[log.type] || '#1B4F8A',
                  fontFamily: 'var(--font-mono)',
                  fontWeight: 700
                }}>
                  {log.typeText}
                </span>
                <span style={{ fontSize: '0.8rem', color: 'var(--primary-pale)', fontFamily: 'var(--font-body)', flex: 1 }}>
                  <strong style={{ color: 'white', marginRight: '6px' }}>{log.busId}</strong>
                  {log.message}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
