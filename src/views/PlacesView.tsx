'use client';

import { useState } from 'react';
import { usePlanStore } from '@/state/usePlanStore';
import { planService } from '@/services';
import { MapPanel } from '@/ui/common/MapPanel';
import { ObjectCard } from '@/ui/common/ObjectCard';
import { Site } from '@/services/types';
import styles from './PlacesView.module.css';
import { Search, Filter } from 'lucide-react';

export function PlacesView() {
    const { sites, issues } = usePlanStore();
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const selectedSite = selectedId ? sites.find(s => s.id === selectedId) : null;
    const siteIssues = selectedSite ? issues.filter(i => i.relatedObjectIds.includes(selectedSite.id)) : [];

    const handleAssessment = async () => {
        if (!selectedSite) return;
        await planService.generateSiteAssessment(selectedSite.planId, selectedSite.id);
        const { refreshData } = usePlanStore.getState();
        await refreshData();
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.toolbar}>
                    <div className={styles.search}>
                        <Search size={16} className="text-tertiary" />
                        <input placeholder="Search places..." className={styles.searchInput} />
                    </div>
                    <button className={styles.filterBtn}><Filter size={16} /></button>
                </div>

                <div className={styles.list}>
                    {sites.map(site => (
                        <ObjectCard
                            key={site.id}
                            title={site.name}
                            subtitle={`${site.sizeHa}ha • ${site.capacity} homes`}
                            type="site"
                            status={site.status}
                            className={selectedId === site.id ? styles.selectedCard : ''}
                            onClick={() => setSelectedId(site.id)}
                        />
                    ))}
                </div>
            </div>

            <div className={styles.mapArea}>
                <MapPanel items={sites} onSelect={setSelectedId} className={styles.map} />

                {selectedSite && (
                    <div className={styles.detailPanel}>
                        <div className={styles.detailHeader}>
                            <h2>{selectedSite.name}</h2>
                            <div className={styles.badge}>{selectedSite.status}</div>
                            <button
                                className={styles.closeBtn}
                                onClick={() => setSelectedId(null)}
                            >
                                Close
                            </button>
                        </div>
                        <p className={styles.address}>{selectedSite.address}</p>

                        <div className={styles.constraints}>
                            {selectedSite.constraints.map(c => (
                                <span key={c} className={styles.constraintTag}>{c}</span>
                            ))}
                        </div>

                        <div className={styles.actions}>
                            <button
                                className={styles.actionBtn}
                                onClick={handleAssessment}
                            >
                                Run Site Assessment
                            </button>
                            <button className={styles.actionBtnSecondary}>Edit Geometry</button>
                        </div>

                        {siteIssues.length > 0 && (
                            <div className={styles.issues}>
                                <h3>Identified Issues</h3>
                                {siteIssues.map(i => (
                                    <div key={i.id} className={styles.issueItem}>
                                        <span className={styles.warningIcon}>⚠</span> {i.title}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
