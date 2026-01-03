'use client';

import { usePlanStore } from '@/state/usePlanStore';
import { planService } from '@/services';
import styles from './MonitoringView.module.css';
import { Activity, ArrowUp, ArrowDown, Minus, AlertCircle, CheckCircle } from 'lucide-react';
import { useState } from 'react';

export function MonitoringView() {
    const { signals, currentPlan, openPatchReview } = usePlanStore();
    const [isProcessing, setIsProcessing] = useState<string | null>(null);

    const handleMitigate = async (signalId: string) => {
        if (!currentPlan) return;
        setIsProcessing(signalId);
        try {
            // Mock a mitigation patch bundle specifically for this signal
            const bundle = await planService.proposePolicyEdits(
                currentPlan.id,
                'POL-H1',
                'Mitigate housing shortfall: accelerate site release'
            );
            openPatchReview(bundle);
        } catch (e) {
            console.error(e);
        } finally {
            setIsProcessing(null);
        }
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <h1>Monitoring & AMR</h1>
                <p>Track delivery against targets and trigger corrective actions.</p>
            </header>

            <div className={styles.grid}>
                {signals.map(signal => (
                    <div key={signal.id} className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div className={styles.metricName}>{signal.metric}</div>
                            <div className={`${styles.statusIcon} ${styles[signal.level]}`}>
                                {signal.level === 'on-track' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                            </div>
                        </div>

                        <div className={styles.stats}>
                            <div className={styles.stat}>
                                <label>Target</label>
                                <div className={styles.value}>{signal.targetValue}</div>
                            </div>
                            <div className={styles.stat}>
                                <label>Current</label>
                                <div className={styles.valueLarge}>{signal.currentValue}</div>
                            </div>
                        </div>

                        <div className={styles.trend}>
                            {signal.trend === 'up' && <ArrowUp size={16} className="text-success" />}
                            {signal.trend === 'down' && <ArrowDown size={16} className="text-error" />}
                            {signal.trend === 'flat' && <Minus size={16} className="text-tertiary" />}
                            <span>Trend vs Last Year</span>
                        </div>

                        {signal.level !== 'on-track' && (
                            <div className={styles.actions}>
                                <div className={styles.alertBox}>
                                    Trigger Point Reached
                                </div>
                                <button
                                    className={styles.mitigateBtn}
                                    onClick={() => handleMitigate(signal.id)}
                                    disabled={isProcessing === signal.id}
                                >
                                    {isProcessing === signal.id ? 'Analyzing...' : 'Propose Mitigation'}
                                </button>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}
