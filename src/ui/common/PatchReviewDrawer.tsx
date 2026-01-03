'use client';

import { usePlanStore } from '@/state/usePlanStore';
import { PlanService } from '@/services/PlanService';
import { TracePanel } from './TracePanel';
import styles from './PatchReviewDrawer.module.css';
import { X, Check, ThumbsUp, ThumbsDown, ArrowRight } from 'lucide-react';
import { planService } from '@/services';

export function PatchReviewDrawer() {
    const { activePatchBundle, isPatchDrawerOpen, closePatchDrawer, currentPlan, refreshData } = usePlanStore();

    if (!isPatchDrawerOpen || !activePatchBundle || !currentPlan) return null;

    const handleAccept = async () => {
        await planService.applyPatchBundle(currentPlan.id, activePatchBundle.id);
        await refreshData();
        closePatchDrawer();
    };

    const handleReject = async () => {
        await planService.rejectPatchBundle(currentPlan.id, activePatchBundle.id);
        closePatchDrawer();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.drawer}>
                <div className={styles.header}>
                    <h2 className={styles.title}>Review AI Proposal</h2>
                    <button onClick={closePatchDrawer} className={styles.closeBtn}><X size={20} /></button>
                </div>

                <div className={styles.content}>
                    <div className={styles.summary}>
                        <h3>{activePatchBundle.title}</h3>
                        <p>{activePatchBundle.description}</p>
                    </div>

                    <TracePanel trace={activePatchBundle.trace} className={styles.trace} />

                    <div className={styles.diffs}>
                        {activePatchBundle.patches.map((patch, idx) => (
                            <div key={idx} className={styles.diffItem}>
                                <div className={styles.diffHeader}>
                                    <span className={styles.opBadge}>{patch.op}</span>
                                    <span className={styles.path}>{patch.path}</span>
                                </div>
                                {patch.value && (
                                    <div className={styles.diffValue}>
                                        {/* Simple visualization for now */}
                                        <pre>{patch.value}</pre>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.actions}>
                    <button onClick={handleReject} className={styles.rejectBtn}>
                        <ThumbsDown size={18} /> Reject
                    </button>
                    <button onClick={handleAccept} className={styles.acceptBtn}>
                        <ThumbsUp size={18} /> Accept
                    </button>
                </div>
            </div>
        </div>
    );
}
