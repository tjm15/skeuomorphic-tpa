'use client';

import { useState } from 'react';
import { usePlanStore } from '@/state/usePlanStore';
import { planService } from '@/services';
import styles from './ProgrammeView.module.css';
import { Calendar, CheckCircle, XCircle, FileText, AlertTriangle } from 'lucide-react';
import { GatewayCut } from '@/services/types';

export function ProgrammeView() {
    const { currentPlan } = usePlanStore();
    const [isRunningCut, setIsRunningCut] = useState(false);
    const [cutResult, setCutResult] = useState<GatewayCut | null>(null);

    const handleRunGateway = async () => {
        if (!currentPlan) return;
        setIsRunningCut(true);
        setCutResult(null);
        try {
            const res = await planService.runGatewayCut(currentPlan.id, 'Gateway 2: Draft Audit');
            setCutResult(res);
        } catch (e) {
            console.error(e);
        } finally {
            setIsRunningCut(false);
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>Programme & Governance</h1>

            <div className={styles.timeline}>
                <div className={styles.timelineItem}>
                    <div className={styles.timelineIconActive}><CheckCircle size={16} /></div>
                    <div className={styles.timelineContent}>
                        <h3>Scoping</h3>
                        <span className={styles.date}>Month 0 (Jan '25)</span>
                    </div>
                </div>
                <div className={styles.timelineLineActive} />

                <div className={styles.timelineItem}>
                    <div className={styles.timelineIconActive}><CheckCircle size={16} /></div>
                    <div className={styles.timelineContent}>
                        <h3>Gateway 1</h3>
                        <span className={styles.date}>Month 6 (Jun '25)</span>
                        <span className={styles.statusLabel}>Passed</span>
                    </div>
                </div>
                <div className={styles.timelineLineActive} />

                <div className={styles.timelineItem}>
                    <div className={styles.timelineIconResult}><div className={styles.pulseRing} /><div className={styles.dot} /></div>
                    <div className={styles.timelineContent}>
                        <h3>Gateway 2</h3>
                        <span className={styles.date}>Month 18 (Jun '26)</span>
                        <span className={styles.badge}>Next Audit</span>
                    </div>
                </div>
                <div className={styles.timelineLine} />

                <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon}><div className={styles.dot} /></div>
                    <div className={styles.timelineContent}>
                        <h3>Gateway 3</h3>
                        <span className={styles.date}>Month 30 (Jun '27)</span>
                    </div>
                </div>
            </div>

            <div className={styles.gatewaySection}>
                <header className={styles.gatewayHeader}>
                    <div className={styles.gwTitle}>
                        <h2>Gateway 2: Draft Plan Audit</h2>
                        <p>Validates plan coherence, evidence coverage, and risk profile against statutory tests.</p>
                    </div>
                    <button
                        className={styles.cutBtn}
                        onClick={handleRunGateway}
                        disabled={isRunningCut}
                    >
                        {isRunningCut ? 'Running Audit...' : 'Execute Gateway 2'}
                    </button>
                </header>

                {cutResult && (
                    <div className={`${styles.resultCard} ${cutResult.status === 'fail' ? styles.fail : styles.pass}`}>
                        <div className={styles.resultHeader}>
                            <div className={styles.scoreCircle}>
                                <span className={styles.score}>{cutResult.score}</span>
                                <span className={styles.scoreLabel}>/100</span>
                            </div>
                            <div className={styles.resultMeta}>
                                <h3>{cutResult.status === 'pass' ? 'Gateway Passed' : 'Gateway Failed'}</h3>
                                <p>{cutResult.status === 'pass' ? 'Plan is coherent; proceed to Publication (Gateway 3).' : 'Critical coherence gaps detected. Remediation required.'}</p>
                            </div>
                            <div className={styles.statusIcon}>
                                {cutResult.status === 'pass' ? <CheckCircle size={32} /> : <XCircle size={32} />}
                            </div>
                        </div>

                        <div className={styles.resultDetails}>
                            <div className={styles.detailCol}>
                                <h4><AlertTriangle size={14} /> Critical Issues</h4>
                                <ul>
                                    {cutResult.issuesFound.map(id => <li key={id}>Issue {id} unresolved</li>)}
                                </ul>
                            </div>
                            <div className={styles.detailCol}>
                                <h4><FileText size={14} /> Missing Items</h4>
                                <ul>
                                    {cutResult.missingItems.map(item => <li key={item}>{item}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
