'use client';

import { ReactNode } from 'react';
import styles from './GlassCard.module.css';

interface GlassCardProps {
    children: ReactNode;
    className?: string;
    style?: React.CSSProperties;
    hoverEffect?: boolean;
    interactive?: boolean;
    onClick?: () => void;
}

export function GlassCard({
    children,
    className = '',
    style,
    hoverEffect = false,
    interactive = false,
    onClick
}: GlassCardProps) {
    return (
        <div
            className={`
                ${styles.card} 
                ${hoverEffect ? styles.hover : ''} 
                ${interactive ? styles.interactive : ''}
                ${className}
            `}
            style={style}
            onClick={onClick}
        >
            <div className={styles.reflection} />
            <div className={styles.content}>
                {children}
            </div>
        </div>
    );
}
