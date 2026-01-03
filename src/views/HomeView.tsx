
'use client';

import React from 'react';
import { ShellLayout } from '@/ui/shell/ShellLayout';
import { SHELLS_V0 } from '@/config/shells';
import { useParams } from 'next/navigation';

export function HomeView() {
    const params = useParams();
    const planId = (params?.planId as string) || 'demo-plan'; // Fallback

    const config = SHELLS_V0['home'];

    return (
        <ShellLayout
            config={config}
            planId={planId}
        />
    );
}
