
import React from 'react';
import { WorkSurface } from '@/ui/primitives/WorkSurface';

interface PlaceholderSurfaceProps {
    title: string;
    icon?: string;
    message?: string;
}

export const PlaceholderSurface: React.FC<PlaceholderSurfaceProps> = ({ title, icon = '🚧', message = 'Implementation pending.' }) => {
    return (
        <WorkSurface>
            <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <div style={{
                    flex: 1,
                    borderRadius: 16,
                    margin: 20,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: '1px dashed var(--border-subtle)',
                }}>
                    <div style={{ textAlign: 'center', opacity: 0.5 }}>
                        <div style={{ fontSize: 48, marginBottom: 16 }}>{icon}</div>
                        <h3 style={{ fontSize: '1.2rem', fontWeight: 500 }}>{title}</h3>
                        <p>{message}</p>
                    </div>
                </div>
            </div>
        </WorkSurface>
    );
};
