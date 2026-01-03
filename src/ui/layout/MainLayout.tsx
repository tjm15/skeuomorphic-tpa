'use client';

import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import styles from './MainLayout.module.css';


import { PatchReviewDrawer } from '@/ui/common/PatchReviewDrawer';

interface MainLayoutProps {
    children: ReactNode;
}

export function MainLayout({ children }: MainLayoutProps) {
    return (
        <div className={styles.container}>
            <Sidebar />
            <div className={styles.contentWrapper}>
                <header className={styles.header}>
                    <div className={styles.breadcrumb}>
                        <span className={styles.planTitle}>Glazebrook Local Plan</span>
                        <span className={styles.planStatus}>
                            {/* Simple mapping for demo */}
                            {/* @ts-ignore - Assuming plan is avail in context for real app, but here just static for layout */}
                            Gateway 2: Plan Drafting
                        </span>
                    </div>
                    <div className={styles.actions}>
                        {/* User profile or actions */}
                        <div className={styles.userAvatar}>TM</div>
                    </div>
                </header>
                <main className={styles.main}>
                    {children}
                </main>
            </div>
            <PatchReviewDrawer />
        </div>
    );
}
