
import React from 'react';
import { PanelConfig } from '@/config/shells';
import { LinkListPanel } from './LinkListPanel';
import { WarrantStackPanel } from './WarrantStackPanel';
import { ContestationStackPanel } from './ContestationStackPanel';

// Placeholder for other panel types
const PlaceholderPanel = ({ title }: { title: string }) => (
    <div style={{ padding: 16, borderBottom: '1px solid var(--border-subtle)' }}>
        <h4 style={{ margin: '0 0 8px 0', fontSize: '0.85rem' }}>{title}</h4>
        <div style={{ fontSize: '0.8rem', color: 'var(--text-tertiary)', fontStyle: 'italic' }}>
            Panel implementation pending
        </div>
    </div>
);

interface PanelRailProps {
    config: PanelConfig[];
    className?: string;
}

export const PanelRail: React.FC<PanelRailProps> = ({ config, className }) => {
    return (
        <aside
            className={className}
            style={{
                width: 320,
                borderLeft: '1px solid var(--glass-border)',
                background: 'var(--bg-glass)',
                backdropFilter: 'blur(var(--glass-blur))',
                overflowY: 'auto'
            }}
        >
            {config.map(panel => {
                switch (panel.kind) {
                    case 'LinkList':
                        return <LinkListPanel key={panel.id} config={panel} />;
                    case 'WarrantStack':
                        return <WarrantStackPanel key={panel.id} config={panel} />;
                    case 'ContestationStack':
                        return <ContestationStackPanel key={panel.id} config={panel} />;
                    default:
                        return <PlaceholderPanel key={panel.id} title={panel.title} />;
                }
            })}
        </aside>
    );
};
