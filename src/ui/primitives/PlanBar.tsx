
import React from 'react';
import styles from './PlanBar.module.css';

export interface PressureChip {
    id: string;
    label: string;
    count?: number;
    status: 'neutral' | 'warning' | 'critical';
    onClick?: () => void;
}

interface PlanBarProps {
    title: string;
    authority: string;
    phase: string;
    nextMilestone?: string;
    pressureChips?: PressureChip[];
}

export const PlanBar: React.FC<PlanBarProps> = ({
    title,
    authority,
    phase,
    nextMilestone,
    pressureChips = []
}) => {
    return (
        <header className={styles.bar}>
            <div className={styles.identity}>
                <div className={styles.authority}>{authority}</div>
                <h1 className={styles.title}>{title}</h1>
            </div>

            <div className={styles.center}>
                <div className={styles.phase}>
                    <span className={styles.phaseLabel}>Current Phase</span>
                    <span className={styles.phaseValue}>{phase}</span>
                </div>
                {nextMilestone && (
                    <div className={styles.milestone}>
                        <span className={styles.milestoneLabel}>Next:</span>
                        {nextMilestone}
                    </div>
                )}
            </div>

            <div className={styles.pressure}>
                {pressureChips.map(chip => (
                    <button
                        key={chip.id}
                        className={`${styles.chip} ${styles[chip.status]}`}
                        onClick={chip.onClick}
                    >
                        <span className={styles.chipCount}>{chip.count}</span>
                        <span className={styles.chipLabel}>{chip.label}</span>
                    </button>
                ))}
            </div>
        </header>
    );
};
