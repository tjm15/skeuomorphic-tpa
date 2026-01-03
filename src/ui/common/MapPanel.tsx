'use client';

import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import styles from './MapPanel.module.css';

// Dynamic import for Leaflet component to avoid SSR issues
const MapView = dynamic(
    () => import('./MapPanelInner'),
    {
        loading: () => <div className={styles.loading}>Loading Map...</div>,
        ssr: false
    }
);

interface MapPanelProps {
    className?: string;
    items?: any[]; // Objects to display
    onSelect?: (id: string) => void;
}

export function MapPanel(props: MapPanelProps) {
    return (
        <div className={`${styles.container} ${props.className || ''}`}>
            <MapView {...props} />
        </div>
    );
}
