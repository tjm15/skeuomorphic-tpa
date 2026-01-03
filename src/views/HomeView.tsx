'use client';

import { useEffect } from 'react';
import { usePlanStore } from '@/state/usePlanStore';
import { ObjectCard } from '@/ui/common/ObjectCard';
import styles from './HomeView.module.css';
import { AlertTriangle, Clock } from 'lucide-react';

export function HomeView() {
    const { loadPlan, currentPlan, issues, isLoading } = usePlanStore();

    useEffect(() => {
        // Hardcoded plan ID for demo
        loadPlan('PLAN-2025-001');
    }, [loadPlan]);

    if (isLoading || !currentPlan) {
        return <div className={styles.loading}>Loading Plan Environment...</div>;
    }

    const criticalIssues = issues.filter(i => i.severity === 'high' || i.severity === 'critical');

    return (
        <div className={styles.container}>
            <header className={styles.hero}>
                <h1 className={styles.title}>{currentPlan.title}</h1>
                <p className={styles.description}>{currentPlan.description}</p>
                <div className={styles.stats}>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>12,000</span>
                        <span className={styles.statLabel}>Homes Target</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>24%</span>
                        <span className={styles.statLabel}>Affordable</span>
                    </div>
                    <div className={styles.statItem}>
                        <span className={styles.statValue}>Reg 18</span>
                        <span className={styles.statLabel}>Current Phase</span>
                    </div>
                </div>
            </header>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <AlertTriangle size={20} className="text-warning" />
                    <h2>Needs Attention</h2>
                </div>
                <div className={styles.grid}>
                    {criticalIssues.length === 0 && <p className={styles.empty}>No critical items.</p>}
                    {criticalIssues.map(issue => (
                        <ObjectCard
                            key={issue.id}
                            title={issue.title}
                            type="issue"
                            status={issue.severity}
                            subtitle={issue.type}
                            onClick={() => console.log('Nav to issue', issue.id)}
                        >
                            {issue.description}
                        </ObjectCard>
                    ))}
                </div>
            </section>

            <section className={styles.section}>
                <div className={styles.sectionHeader}>
                    <Clock size={20} className="text-secondary" />
                    <h2>Recent Activity</h2>
                </div>
                <div className={styles.grid}>
                    {/* Mock recent items */}
                    <ObjectCard title="Pol-H1: Housing Target" type="policy" subtitle="Updated 2h ago" status="proposed" />
                    <ObjectCard title="Site NGL-04" type="site" subtitle="Assessment generated" status="shortlisted" />
                </div>
            </section>
        </div>
    );
}
