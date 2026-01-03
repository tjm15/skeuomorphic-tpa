'use client';

import { useState } from 'react';
import { usePlanStore } from '@/state/usePlanStore';
import { planService } from '@/services';
import { ObjectCard } from '@/ui/common/ObjectCard';
import { GlassCard } from '@/ui/common/GlassCard';
import styles from './PoliciesView.module.css';
import { FileText, Sparkles, AlertCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export function PoliciesView() {
    const { policies, issues, openPatchReview, refreshData } = usePlanStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    // Default to first if none selected
    const activePolicyId = selectedId || (policies.length > 0 ? policies[0].id : null);
    const activePolicy = policies.find(p => p.id === activePolicyId);
    const policyIssues = activePolicy ? issues.filter(i => i.relatedObjectIds.includes(activePolicy.id)) : [];

    const handleAiEdit = async () => {
        if (!activePolicy) return;
        setIsGenerating(true);
        try {
            // Hardcoded intent for demo
            const bundle = await planService.proposePolicyEdits(
                activePolicy.planId,
                activePolicy.id,
                "Add viability clause"
            );
            openPatchReview(bundle);
        } catch (e) {
            console.error(e);
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <h2 className={styles.sidebarTitle}>Policies</h2>
                <div className={styles.list}>
                    {policies.map(policy => (
                        <GlassCard
                            key={policy.id}
                            className={`${styles.item} ${activePolicyId === policy.id ? styles.itemActive : ''}`}
                            onClick={() => setSelectedId(policy.id)}
                            hoverEffect
                            interactive
                        >
                            <div className={styles.itemHeader}>
                                <span className={styles.code}>{policy.code}</span>
                                <span className={styles.status}>{policy.status}</span>
                            </div>
                            <div className={styles.itemTitle}>{policy.title}</div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <div className={styles.main}>
                {activePolicy ? (
                    <>
                        <header className={styles.header}>
                            <div className={styles.headerLeft}>
                                <h1>{activePolicy.code}: {activePolicy.title}</h1>
                                <div className={styles.tags}>
                                    {activePolicy.tags.map(tag => (
                                        <span key={tag} className={styles.tag}>{tag}</span>
                                    ))}
                                </div>
                            </div>
                            <button
                                className={styles.aiButton}
                                onClick={handleAiEdit}
                                disabled={isGenerating}
                            >
                                <Sparkles size={16} />
                                {isGenerating ? 'Drafting...' : 'AI Edit'}
                            </button>
                        </header>

                        <div className={styles.content}>
                            <div className={styles.intentBox}>
                                <h3>Pixel - Policy Intent</h3>
                                <p>{activePolicy.intent}</p>
                            </div>

                            <div className={styles.policyText}>
                                <ReactMarkdown>{activePolicy.text}</ReactMarkdown>
                            </div>

                            {policyIssues.length > 0 && (
                                <div className={styles.issues}>
                                    {policyIssues.map(issue => (
                                        <div key={issue.id} className={styles.issue}>
                                            <AlertCircle size={16} className="text-error" />
                                            <span>{issue.title}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                ) : (
                    <div className={styles.empty}>Select a policy to view.</div>
                )}
            </div>
        </div>
    );
}
