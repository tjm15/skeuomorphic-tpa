
import React from 'react';
import styles from './EdgeChip.module.css';

export interface EdgeChipProps {
    type: 'supports' | 'contests' | 'applies_to' | 'depends_on' | 'derived_from' | string;
    count: number;
    mode?: 'default' | 'marginalia'; // default = chip, marginalia = small anchor
    active?: boolean; // If linked panel is open
    warning?: boolean; // If linked items have issues
    onClick?: () => void;
}

export const EdgeChip: React.FC<EdgeChipProps> = ({
    type,
    count,
    mode = 'default',
    active,
    warning,
    onClick
}) => {
    // Format label: "Supports (6)"
    const label = type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');

    return (
        <button
            className={`
                ${styles.chip} 
                ${styles[mode]} 
                ${styles[type]} 
                ${active ? styles.active : ''}
                ${warning ? styles.warning : ''}
            `}
            onClick={onClick}
            title={`${label}: ${count} items`}
        >
            {mode === 'marginalia' ? (
                <>
                    <span className={styles.icon} /> {/* CSS icon based on type */}
                    <span className={styles.count}>{count}</span>
                </>
            ) : (
                <>
                    <span className={styles.label}>{label}</span>
                    <span className={styles.count}>({count})</span>
                </>
            )}
        </button>
    );
};
