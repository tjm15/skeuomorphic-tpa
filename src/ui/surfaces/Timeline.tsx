
import React from 'react';
import { WorkSurface } from '@/ui/primitives/WorkSurface';
import { GlassCard } from '@/ui/common/GlassCard';

export const Timeline: React.FC = () => {
    // Mock data for CULP 30-month timeline
    const milestones = [
        { id: 'm1', title: 'Gateway 1: Scoping', date: 'Month 1', status: 'completed' },
        { id: 'm2', title: 'Gateway 2: Draft Plan', date: 'Month 12', status: 'active' },
        { id: 'm3', title: 'Gateway 3: Submission', date: 'Month 24', status: 'pending' },
        { id: 'm4', title: 'Examination', date: 'Month 28', status: 'pending' },
        { id: 'm5', title: 'Adoption', date: 'Month 30', status: 'pending' },
    ];

    return (
        <WorkSurface>
            <div style={{ maxWidth: 600, margin: '0 auto', paddingBottom: 40 }}>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 24, textAlign: 'center' }}>
                    Programme Timeline (30-month)
                </h2>

                <div style={{ position: 'relative', paddingLeft: 20 }}>
                    {/* Vertical Line */}
                    <div style={{ position: 'absolute', left: 29, top: 10, bottom: 10, width: 2, background: 'var(--border-subtle)' }} />

                    <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
                        {milestones.map((m, idx) => (
                            <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 20, position: 'relative' }}>
                                {/* Dot */}
                                <div style={{
                                    width: 20, height: 20, borderRadius: '50%',
                                    background: m.status === 'completed' ? 'var(--accent-success)' : m.status === 'active' ? 'var(--accent-primary)' : 'var(--bg-surface)',
                                    border: '2px solid var(--border-default)',
                                    zIndex: 1
                                }} />

                                <GlassCard style={{ flex: 1, padding: 16, opacity: m.status === 'pending' ? 0.6 : 1 }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                                        <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{m.title}</div>
                                        <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', background: 'rgba(0,0,0,0.1)', padding: '2px 8px', borderRadius: 10 }}>{m.date}</div>
                                    </div>
                                    <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)' }}>
                                        {m.status === 'active' ? 'Current Phase' : m.status === 'completed' ? 'Signed Off' : 'Future Milestone'}
                                    </div>
                                </GlassCard>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </WorkSurface>
    );
};
