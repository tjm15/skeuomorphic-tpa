'use client';

import { JudgementTrace } from '@/services/types';
import styles from './TracePanel.module.css';
import { BookOpen, BrainCircuit } from 'lucide-react';

interface TracePanelProps {
    trace?: JudgementTrace;
    className?: string;
}

export function TracePanel({ trace, className }: TracePanelProps) {
    if (!trace) return null;

    return (
        <div className={`${styles.container} ${className || ''}`}>
            <div className={styles.section}>
                <div className={styles.header}>
                    <BrainCircuit size={16} className={styles.icon} />
                    <span className={styles.label}>Reasoning ({trace.model})</span>
                </div>
                <p className={styles.text}>{trace.reasoning}</p>
            </div>

            {trace.citations.length > 0 && (
                <div className={styles.section}>
                    <div className={styles.header}>
                        <BookOpen size={16} className={styles.icon} />
                        <span className={styles.label}>Evidence Citations</span>
                    </div>
                    <div className={styles.citations}>
                        {trace.citations.map(citeId => (
                            <span key={citeId} className={styles.citationBadge}>{citeId}</span>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
