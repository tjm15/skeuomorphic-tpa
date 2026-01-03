'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { FileText, MapPin, Database, AlertCircle, Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import styles from './ObjectCard.module.css';

interface ObjectCardProps {
    title: string;
    subtitle?: string;
    type: 'policy' | 'site' | 'evidence' | 'issue' | 'signal';
    status?: string;
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
}

export function ObjectCard({
    title, subtitle, type, status, children, onClick, className
}: ObjectCardProps) {

    const Icon = {
        policy: FileText,
        site: MapPin,
        evidence: Database,
        issue: AlertCircle,
        signal: Activity
    }[type];

    const statusColor = getStatusColor(status);

    return (
        <GlassCard
            className={clsx(styles.cardContent, className)}
            onClick={onClick}
            interactive={!!onClick}
            hoverEffect={!!onClick}
        >
            <div className={styles.header}>
                <div className={styles.iconWrapper}>
                    <Icon size={18} />
                </div>
                <div className={styles.titleWrapper}>
                    <h3 className={styles.title}>{title}</h3>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>
                {status && (
                    <span className={clsx(styles.statusBadge)} style={{
                        backgroundColor: statusColor.bg,
                        color: statusColor.text,
                        boxShadow: `0 0 10px ${statusColor.bg}`
                    }}>
                        {status}
                    </span>
                )}
            </div>
            {children && <div className={styles.body}>{children}</div>}
        </GlassCard>
    );
}

function getStatusColor(status?: string) {
    if (!status) return { bg: 'var(--bg-active)', text: 'var(--text-secondary)' };

    const s = status.toLowerCase();
    if (['adopted', 'allocated', 'on-track', 'pass', 'accepted'].includes(s))
        return { bg: 'var(--status-success-bg)', text: 'var(--status-success-text)' };
    if (['draft', 'candidate', 'proposed', 'pending'].includes(s))
        return { bg: 'var(--status-info-bg)', text: 'var(--status-info-text)' };
    if (['risk', 'warning', 'shortlisted'].includes(s))
        return { bg: 'var(--status-warning-bg)', text: 'var(--status-warning-text)' };
    if (['critical', 'fail', 'rejected', 'gap', 'contradiction', 'high'].includes(s))
        return { bg: 'var(--status-error-bg)', text: 'var(--status-error-text)' };

    return { bg: 'var(--bg-active)', text: 'var(--text-secondary)' };
}
