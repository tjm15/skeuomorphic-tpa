'use client';

import { useEffect } from 'react';
import { usePlanStore } from '@/state/usePlanStore';
import { ObjectCard } from '@/ui/common/ObjectCard';
import { GlassCard } from '@/ui/common/GlassCard';
import styles from './HomeView.module.css';
import { AlertTriangle, Clock, Activity, Target, Layers } from 'lucide-react';

export function HomeView() {
    const { loadPlan, currentPlan, issues, isLoading } = usePlanStore();

    useEffect(() => {
        // Hardcoded plan ID for demo
        loadPlan('PLAN-2025-001');
    }, [loadPlan]);

    if (isLoading || !currentPlan) {
        return <div className={styles.loading}>Initializing Command Interface...</div>;
    }

    const criticalIssues = issues.filter(i => i.severity === 'high' || i.severity === 'critical');

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className={styles.title}>{currentPlan.title}</h1>
                <p className={styles.description}>{currentPlan.description}</p>
                <div className={styles.stats}>
                    <GlassCard className={styles.statCard}>
                        <div className="flex items-center gap-2 mb-2 text-indigo-400">
                            <Target size={16} />
                            <span className={styles.statLabel}>Target</span>
                        </div>
                        <span className={styles.statValue}>12,000</span>
                        <div className="text-xs text-secondary mt-1">Homes (2025-2040)</div>
                    </GlassCard>

                    <GlassCard className={styles.statCard}>
                        <div className="flex items-center gap-2 mb-2 text-emerald-400">
                            <Activity size={16} />
                            <span className={styles.statLabel}>Affordable</span>
                        </div>
                        <span className={styles.statValue}>24%</span>
                        <div className="text-xs text-secondary mt-1">Current Projection</div>
                    </GlassCard>

                    <GlassCard className={styles.statCard}>
                        <div className="flex items-center gap-2 mb-2 text-amber-400">
                            <Layers size={16} />
                            <span className={styles.statLabel}>Phase</span>
                        </div>
                        <span className={styles.statValue}>Reg 18</span>
                        <div className="text-xs text-secondary mt-1">Gateway 2 Active</div>
                    </GlassCard>
                </div>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <AlertTriangle size={20} className="text-amber-500 shadow-glow" />
                    <h2>Needs Attention</h2>
                </div>
                <div className={styles.grid}>
                    {criticalIssues.length === 0 && <p className={styles.empty}>System nominal. No critical items.</p>}
                    {criticalIssues.map(issue => (
                        <ObjectCard
                            key={issue.id}
                            title={issue.title}
                            type="issue"
                            status={issue.severity}
                            subtitle={issue.type.toUpperCase()}
                            onClick={() => console.log('Nav to issue', issue.id)}
                            className="border-amber-500/30"
                        >
                            {issue.description}
                        </ObjectCard>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Clock size={20} className="text-indigo-400" />
                    <h2>Recent Activity</h2>
                </div>
                <div className={styles.grid}>
                    {/* Mock recent items */}
                    <ObjectCard title="Pol-H1: Housing Target" type="policy" subtitle="Updated 2h ago" status="proposed" />
                    <ObjectCard title="Site NGL-04" type="site" subtitle="Assessment generated" status="shortlisted" />
                    <ObjectCard title="Evidence Upload: FLood Risk" type="evidence" subtitle="Added 4h ago" status="indexed" />
                </div>
            </section>
        </div>
    );
}
