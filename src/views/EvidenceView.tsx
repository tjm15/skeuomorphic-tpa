'use client';

import { useState } from 'react';
import { usePlanStore } from '@/state/usePlanStore';
import { ObjectCard } from '@/ui/common/ObjectCard';
import { GlassCard } from '@/ui/common/GlassCard';
import styles from './EvidenceView.module.css';
import { UploadCloud, Filter, FileText, BarChart, Map } from 'lucide-react';
import { EvidenceItem } from '@/services/types';

export function EvidenceView() {
    const { evidence } = usePlanStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);
    const [filterType, setFilterType] = useState<string>('all');

    const selectedItem = evidence.find(e => e.id === selectedId);

    const filteredEvidence = filterType === 'all'
        ? evidence
        : evidence.filter(e => e.type === filterType);

    const handleUpload = () => {
        alert("Mock Upload: This would open a file picker and ingest the document via the pipeline.");
    };

    return (
        <div className={styles.container}>
            <div className={styles.mainSection}>
                <header className={styles.header}>
                    <div className={styles.title}>
                        <h1>Evidence Base</h1>
                        <p>{evidence.length} documents indexed and searchable</p>
                    </div>
                    <div className={styles.actions}>
                        <button className={styles.uploadBtn} onClick={handleUpload}>
                            <UploadCloud size={16} />
                            Upload Evidence
                        </button>
                    </div>
                </header>

                <div className={styles.filterBar}>
                    {['all', 'document', 'dataset', 'map'].map(type => (
                        <button
                            key={type}
                            className={`${styles.filterChip} ${filterType === type ? styles.active : ''}`}
                            onClick={() => setFilterType(type)}
                        >
                            {type.charAt(0).toUpperCase() + type.slice(1)}s
                        </button>
                    ))}
                </div>

                <div className={styles.grid}>
                    {filteredEvidence.map(item => (
                        <ObjectCard
                            key={item.id}
                            title={item.title}
                            type="evidence"
                            subtitle={`${item.source} • ${new Date(item.uploadDate).toLocaleDateString()}`}
                            status={item.type === 'dataset' ? 'processed' : 'indexed'}
                            onClick={() => setSelectedId(item.id)}
                            className={selectedId === item.id ? 'border-primary' : ''}
                        />
                    ))}

                    {/* Mock Empty State if needed */}
                    {filteredEvidence.length === 0 && (
                        <div className="text-center p-10 text-tertiary">
                            No evidence found for this filter.
                        </div>
                    )}
                </div>
            </div>

            {selectedItem && (
                <GlassCard className={styles.previewPanel}>
                    <div className={styles.previewHeader}>
                        <div>
                            <h2 className={styles.previewTitle}>{selectedItem.title}</h2>
                            <div className={styles.previewMeta}>
                                <span>Uploaded: {new Date(selectedItem.uploadDate).toLocaleString()}</span>
                                <span>Source: {selectedItem.source}</span>
                            </div>
                        </div>
                        <button onClick={() => setSelectedId(null)} className="text-tertiary hover:text-primary">✕</button>
                    </div>

                    <div className={styles.previewSection}>
                        <h3 className={styles.sectionTitle}>AI Summary</h3>
                        <div className={styles.summaryBox}>
                            {selectedItem.summary || "No summary generated yet. The ingestion pipeline runs automatically on upload."}
                        </div>
                    </div>

                    <div className={styles.previewSection}>
                        <h3 className={styles.sectionTitle}>Key Claims Extracted</h3>
                        <div className={styles.claimsList}>
                            <div className={styles.claimItem}>
                                "Assessed housing need is 780 dpa based on standard method."
                            </div>
                            <div className={styles.claimItem}>
                                "Market signals indicate high affordability pressure in North Glazebrook."
                            </div>
                        </div>
                    </div>

                    <div className={styles.previewSection}>
                        <h3 className={styles.sectionTitle}>Linked Policies</h3>
                        <div className="flex flex-wrap gap-2">
                            <span className="px-2 py-1 bg-white/5 rounded text-xs border border-white/10">POL-H1</span>
                            <span className="px-2 py-1 bg-white/5 rounded text-xs border border-white/10">POL-TC1</span>
                        </div>
                    </div>
                </GlassCard>
            )}
        </div>
    );
}
