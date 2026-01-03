'use client';

import { ReactNode } from 'react';
import { clsx } from 'clsx';
import { FileText, MapPin, Database, AlertCircle, Activity } from 'lucide-react';
import { GlassCard } from './GlassCard';
import styles from './ObjectCard.module.css';

export interface ObjectCardProps {
    title: string;
    subtitle?: string;
    type: 'policy' | 'site' | 'evidence' | 'issue' | 'signal';
    status?: string;
    children?: ReactNode;
    onClick?: () => void;
    className?: string;
    // Extended props
    isContested?: boolean;
    isSuperseded?: boolean;
    isBound?: boolean;
    edgeChips?: Array<{ type: string; count: number }>;
    style?: React.CSSProperties;
}

export function ObjectCard({
    title, subtitle, type, status, children, onClick, className,
    isContested, isSuperseded, isBound, edgeChips = [], style
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
            className={clsx(
                styles.cardContent,
                isContested && styles.contested,
                isSuperseded && styles.superseded,
                className
            )}
            style={style}
            onClick={onClick}
            interactive={!!onClick}
            hoverEffect={!!onClick}
        >
            {isBound && (
                <div className={styles.seal}>
                    SEALED
                </div>
            )}

            <div className={styles.header}>
                <div className={styles.titleBlock}>
                    <span className={styles.typeLabel}>{type}</span>
                    <h3 className={styles.title}>{title}</h3>
                    {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
                </div>

                {status && !isSuperseded && (
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

            {edgeChips.length > 0 && (
                <div className={styles.footer}>
                    {edgeChips.map((chip, i) => (
                        // Using inline trivial rendering or could import EdgeChip.
                        // For now, let's use a simple chip to avoid circular dep or move issues, 
                        // or better: Use EdgeChip if valid.
                        // I will render simple spans here for now to fit the generic card, or import EdgeChip if I update imports.
                        // Let's stick to the styling defined in ObjectCard for now or reuse primitive if easy.
                        // Actually, I should import EdgeChip from primitives.
                        <div key={i} title={`${chip.type}: ${chip.count}`}
                            style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                            {chip.type} ({chip.count})
                        </div>
                    ))}
                </div>
            )}
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
