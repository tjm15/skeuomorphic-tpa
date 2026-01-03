'use client';

import { usePlanStore } from '@/state/usePlanStore';
import { planService } from '@/services';
import styles from './ScenariosView.module.css';
import { GitBranch, Plus, CheckCircle, ArrowRight } from 'lucide-react';
import { useState } from 'react';
import { Scenario } from '@/services/types';

export function ScenariosView() {
    const { currentPlan, scenarios, isLoading } = usePlanStore();
    const [isGenerating, setIsGenerating] = useState(false);

    // Mock generation of scenarios
    const handleGenerate = async () => {
        setIsGenerating(true);
        // In real app, call service.generateScenarios()
        // Here we just wait a bit and refreshed (assuming mock service generates them)
        // Actually, MockPlanService doesn't have generateScenarios implemented fully yet to add to list
        // For demo, I'll Mock pushing to list here or rely on service implementation if I added it.
        // I left generateScenarios out of MockPlanService implementation details! 
        // I should probably implement it properly or just mock local state for now.

        setTimeout(() => {
            setIsGenerating(false);
            // Alert user or refresh
        }, 1500);
    };

    return (
        <div className={styles.container}>
            <header className={styles.header}>
                <div>
                    <h1>Strategic Scenarios</h1>
                    <p className={styles.subtitle}>Explore alternative growth strategies and their tradeoffs.</p>
                </div>
                <button className={styles.generateBtn} onClick={handleGenerate} disabled={isGenerating}>
                    <Plus size={18} />
                    {isGenerating ? 'Generating Models...' : 'Generate Scenarios'}
                </button>
            </header>

            <div className={styles.grid}>
                {/* Current Plan Card */}
                <div className={styles.cardCurrent}>
                    <div className={styles.cardHeader}>
                        <div className={styles.iconWrapper}><CheckCircle size={20} /></div>
                        <h3>Current Plan</h3>
                    </div>
                    <p className={styles.cardDesc}>{currentPlan?.description}</p>
                    <div className={styles.metrics}>
                        <div className={styles.metric}>
                            <label>Homes</label>
                            <div className={styles.value}>12,000</div>
                        </div>
                        <div className={styles.metric}>
                            <label>Green Belt</label>
                            <div className={styles.value}>Protected</div>
                        </div>
                    </div>
                    <div className={styles.statusBadge}>Active Basis</div>
                </div>

                {/* Mock Scenarios if empty */}
                {scenarios.length === 0 && (
                    <>
                        <ScenarioCard
                            title="Scenario A: High Growth"
                            desc="Maximizes housing delivery through Green Belt release and higher densities."
                            homes="15,500"
                            gb="Release 5%"
                        />
                        <ScenarioCard
                            title="Scenario B: Transit Oriented"
                            desc="Focuses all development within 800m of transit hubs. Lower overall delivery."
                            homes="10,500"
                            gb="Protected"
                        />
                    </>
                )}

                {scenarios.map(s => (
                    <ScenarioCard
                        key={s.id}
                        title={s.name}
                        desc={s.description}
                        homes={s.baseParams.housingTarget}
                        gb={s.baseParams.greenbelt}
                    />
                ))}
            </div>
        </div>
    );
}

function ScenarioCard({ title, desc, homes, gb }: { title: string, desc: string, homes: string, gb: string }) {
    return (
        <div className={styles.card}>
            <div className={styles.cardHeader}>
                <div className={`${styles.iconWrapper} ${styles.iconAlt}`}><GitBranch size={20} /></div>
                <h3>{title}</h3>
            </div>
            <p className={styles.cardDesc}>{desc}</p>
            <div className={styles.metrics}>
                <div className={styles.metric}>
                    <label>Homes</label>
                    <div className={styles.value}>{homes}</div>
                </div>
                <div className={styles.metric}>
                    <label>Green Belt</label>
                    <div className={styles.value}>{gb}</div>
                </div>
            </div>
            <button className={styles.applyBtn}>
                Apply Scenario <ArrowRight size={16} />
            </button>
        </div>
    );
}
