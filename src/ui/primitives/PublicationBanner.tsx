
import React from 'react';
import styles from './PublicationBanner.module.css';

interface PublicationBannerProps {
    publishedAt: string;
    publicUrl?: string; // or ID
    publicationLabel: string; // e.g. "Gateway 2 Draft Plan"
    onViewPublic?: () => void;
}

export const PublicationBanner: React.FC<PublicationBannerProps> = ({
    publishedAt,
    publicUrl,
    publicationLabel,
    onViewPublic
}) => {
    return (
        <div className={styles.banner}>
            <div className={styles.icon}>
                {/* Globe or Document Icon */}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M2 12h20"></path>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
            </div>
            <div className={styles.info}>
                <span className={styles.label}>Published Record</span>
                <span className={styles.details}>
                    {publicationLabel} • {new Date(publishedAt).toLocaleDateString()}
                </span>
            </div>
            {onViewPublic && (
                <button className={styles.action} onClick={onViewPublic}>
                    View Public Instance &rarr;
                </button>
            )}
        </div>
    );
};
