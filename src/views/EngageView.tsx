'use client';

import { usePlanStore } from '@/state/usePlanStore';
import { GlassCard } from '@/ui/common/GlassCard';
import { ObjectCard } from '@/ui/common/ObjectCard';
import styles from './EngageView.module.css';
import { MessageSquare, Users, TrendingUp } from 'lucide-react';
import { useState } from 'react';

export function EngageView() {
    const { issues } = usePlanStore();

    // Filter for representation issues (themes)
    const themes = issues.filter(i => i.type === 'representation');

    // Mock incoming feed
    const [messages] = useState([
        { id: 1, author: 'Local Resident', text: 'The traffic on Station Road is already terrible, 1200 homes will make it gridlock.', date: '10m ago' },
        { id: 2, author: 'Green Alliance', text: 'We support the biodiversity gain but the buffer zone must be 20m not 10m.', date: '1h ago' },
        { id: 3, author: 'Chamber of Commerce', text: 'The pedestrianisation of High St is vital for footfall, fully support TC1.', date: '3h ago' },
        { id: 4, author: 'Resident', text: 'Where will the new school be? The current one is oversubscribed.', date: '5h ago' },
    ]);

    return (
        <div className={styles.container}>
            <div className={styles.column} style={{ flex: 1.2 }}>
                <div className={styles.title}>
                    <h1>Consultation & Engage</h1>
                    <p>Live feed of representations and AI clustering</p>
                </div>

                <div className={styles.statsBar}>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>1,248</span>
                        <span className={styles.statLabel}>Total Reps</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>84%</span>
                        <span className={styles.statLabel}>Processed</span>
                    </div>
                    <div className={styles.stat}>
                        <span className={styles.statValue}>12</span>
                        <span className={styles.statLabel}>Active Clusters</span>
                    </div>
                </div>

                <div className={styles.sectionHeader}>
                    <h2><MessageSquare size={14} className="inline mr-2" /> Recent Submissions</h2>
                </div>

                <div className={styles.list}>
                    {messages.map(msg => (
                        <GlassCard key={msg.id} className={styles.messageCard} hoverEffect>
                            <div className={styles.msgHeader}>
                                <span className={styles.msgAuthor}>{msg.author}</span>
                                <span>{msg.date}</span>
                            </div>
                            <div className={styles.msgBody}>{msg.text}</div>
                        </GlassCard>
                    ))}
                </div>
            </div>

            <div className={styles.column} style={{ flex: 2 }}>
                <div className={styles.sectionHeader}>
                    <h2><TrendingUp size={14} className="inline mr-2" /> Emergent Themes (Issues)</h2>
                </div>

                <div className={styles.list}>
                    {themes.length === 0 && (
                        <div className="p-8 text-center text-tertiary">No themes clustered yet.</div>
                    )}
                    {themes.map(theme => (
                        <ObjectCard
                            key={theme.id}
                            title={theme.title}
                            type="issue"
                            status={theme.severity}
                            subtitle={`Cluster based on ${theme.description}`}
                            onClick={() => console.log('View theme', theme.id)}
                        >
                            <div className="mt-2 flex gap-2">
                                <span className="text-xs bg-white/5 px-2 py-1 rounded">24 related reps</span>
                                <span className="text-xs bg-white/5 px-2 py-1 rounded">Sentiment: Negative</span>
                            </div>
                        </ObjectCard>
                    ))}
                </div>
            </div>
        </div>
    );
}
