
import React from 'react';
import { WorkSurface } from '@/ui/primitives/WorkSurface';

export const MapCanvas: React.FC = () => {
    return (
        <WorkSurface>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    flex: 1,
                    background: 'var(--bg-inset)',
                    borderRadius: 16,
                    margin: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px solid var(--border-subtle)',
                    boxShadow: 'inset 0 2px 10px rgba(0,0,0,0.1)'
                }}>
                    <div style={{ textAlign: 'center', opacity: 0.5 }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>🗺️</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>Spatial View</h3>
                        <p>Map Canvas implementation pending integration with Mapbox/Leaflet.</p>
                    </div>
                </div>
            </div>
        </WorkSurface>
    );
};
