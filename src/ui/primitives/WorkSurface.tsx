
import React from 'react';
import styles from './WorkSurface.module.css';

interface WorkSurfaceProps {
    children: React.ReactNode;
    className?: string; // Allow extension
}

export const WorkSurface: React.FC<WorkSurfaceProps> = ({ children, className }) => {
    return (
        <main className={`${styles.surface} ${className || ''}`}>
            {children}
        </main>
    );
};
