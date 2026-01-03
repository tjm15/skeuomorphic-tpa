'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home, Calendar, FileText, Map, Database, MessageSquare,
    GitBranch, Activity, Settings
} from 'lucide-react';
import { clsx } from 'clsx';
import styles from './Sidebar.module.css';

const NAV_ITEMS = [
    { label: 'Home', href: '/', icon: Home },
    { label: 'Programme', href: '/programme', icon: Calendar },
    { label: 'Policies', href: '/policies', icon: FileText },
    { label: 'Places', href: '/places', icon: Map },
    { label: 'Evidence', href: '/evidence', icon: Database },
    { label: 'Engage', href: '/engage', icon: MessageSquare },
    { label: 'Scenarios', href: '/scenarios', icon: GitBranch },
    { label: 'Monitoring', href: '/monitoring', icon: Activity },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className={styles.sidebar}>
            <div className={styles.logo}>
                <div className={styles.logoIcon} />
                <span className={styles.logoText}>TPA</span>
            </div>

            <nav className={styles.nav}>
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={clsx(styles.navItem, isActive && styles.active)}
                        >
                            <Icon size={20} />
                            <span>{item.label}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className={styles.footer}>
                <button className={styles.navItem}>
                    <Settings size={20} />
                    <span>Settings</span>
                </button>
            </div>
        </aside>
    );
}
