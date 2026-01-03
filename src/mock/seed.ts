import { Plan, Policy, Site, EvidenceItem, Issue, MonitoringSignal, Scenario } from '../services/types';

export const SEED_PLAN: Plan = {
    id: 'PLAN-2025-001',
    title: 'Glazebrook Local Plan 2025-2040',
    localAuthority: 'Glazebrook District Council',
    phase: 'gateway-2',
    horizonStart: 2025,
    horizonEnd: 2040,
    description: 'A sustainable growth strategy for Glazebrook, focusing on town centre regeneration and green belt preservation.',
    createdAt: '2025-01-01T10:00:00Z',
    updatedAt: '2025-06-15T14:30:00Z',
};

export const SEED_POLICIES: Policy[] = [
    {
        id: 'POL-H1',
        planId: 'PLAN-2025-001',
        code: 'H1',
        title: 'Housing Requirement',
        intent: 'To ensure sufficient housing delivery to meet local needs.',
        text: 'Provision will be made for at least **12,000 net new dwellings** between 2025 and 2040. Key strategic sites are identified in the Sites Register.',
        status: 'proposed',
        tags: ['Strategic', 'Housing'],
        version: 1,
        linkedEvidenceIds: ['EV-001', 'EV-002'],
    },
    {
        id: 'POL-E1',
        planId: 'PLAN-2025-001',
        code: 'E1',
        title: 'Green Infrastructure',
        intent: 'Protect and enhance the network of green spaces.',
        text: 'All major developments must demonstrate a **10% Biodiversity Net Gain**. Development on designated Green Belt land will only be permitted in very special circumstances.',
        status: 'adopted',
        tags: ['Environment', 'Green Belt'],
        version: 2,
        linkedEvidenceIds: ['EV-003'],
    },
    {
        id: 'POL-TC1',
        planId: 'PLAN-2025-001',
        code: 'TC1',
        title: 'Town Centre Regeneration',
        intent: 'Revitalize the high street through mixed-use development.',
        text: 'The High Street Primary Shopping Area is designated for Class E uses. Residential use above ground floor is encouraged.',
        status: 'draft',
        tags: ['Economy', 'Regeneration'],
        version: 1,
        linkedEvidenceIds: [],
    }
];

export const SEED_SITES: Site[] = [
    {
        id: 'SITE-001',
        planId: 'PLAN-2025-001',
        ref: 'NGL-04',
        name: 'North Glazebrook Urban Extension',
        address: 'Land North of Station Road',
        sizeHa: 45.5,
        capacity: 1200,
        status: 'shortlisted',
        coordinates: [51.505, -0.09], // Placeholder
        constraints: ['Flood Zone 2 (Part)', 'Noise'],
        proposedUse: 'Mixed Use'
    },
    {
        id: 'SITE-002',
        planId: 'PLAN-2025-001',
        ref: 'TC-09',
        name: 'Old Bus Depot',
        address: 'High Street, Glazebrook',
        sizeHa: 1.2,
        capacity: 85,
        status: 'allocated',
        coordinates: [51.508, -0.08],
        constraints: ['Conservation Area'],
        proposedUse: 'Residential'
    },
    {
        id: 'SITE-003',
        planId: 'PLAN-2025-001',
        ref: 'GB-12',
        name: 'West Farm',
        address: 'West Lane, Glazebrook',
        sizeHa: 120,
        capacity: 2500,
        status: 'candidate',
        coordinates: [51.51, -0.1],
        constraints: ['Green Belt', 'AONB'],
        proposedUse: 'Garden Village'
    }
];

export const SEED_EVIDENCE: EvidenceItem[] = [
    {
        id: 'EV-001',
        planId: 'PLAN-2025-001',
        title: 'Strategic Housing Market Assessment (SHMA)',
        type: 'document',
        uploadDate: '2024-11-20T09:00:00Z',
        source: 'External Consultant',
        summary: 'Identifies an objective assessed need of 780 dpa.'
    },
    {
        id: 'EV-002',
        planId: 'PLAN-2025-001',
        title: 'Housing Land Availability Assessment (HELAA)',
        type: 'dataset',
        uploadDate: '2025-01-15T11:30:00Z',
        source: 'Internal',
        summary: 'Capacity for 14,500 homes identified across all sites.'
    },
    {
        id: 'EV-003',
        planId: 'PLAN-2025-001',
        title: 'Biodiversity Metric 4.0 Calculation',
        type: 'dataset',
        uploadDate: '2025-02-01T14:20:00Z',
        source: 'Environment Agency',
    }
];

export const SEED_MONITORING: MonitoringSignal[] = [
    {
        id: 'SIG-001',
        planId: 'PLAN-2025-001',
        metric: 'Annual Housing Delivery',
        targetValue: 800,
        currentValue: 650,
        trend: 'down',
        level: 'risk',
        lastUpdated: '2025-05-30T00:00:00Z'
    },
    {
        id: 'SIG-002',
        planId: 'PLAN-2025-001',
        metric: 'Affordable Housing %',
        targetValue: 35,
        currentValue: 32,
        trend: 'flat',
        level: 'on-track',
        lastUpdated: '2025-05-30T00:00:00Z'
    }
];

export const SEED_ISSUES: Issue[] = [
    {
        id: 'ISS-001',
        planId: 'PLAN-2025-001',
        title: 'Housing Shortfall vs SHMA',
        description: 'Current allocations sum to 11,500, but target is 12,000.',
        severity: 'high',
        type: 'gap',
        relatedObjectIds: ['POL-H1'],
        resolved: false
    },
    {
        id: 'ISS-002',
        planId: 'PLAN-2025-001',
        title: 'High Street Pedestrianisation Concerns',
        description: 'Cluster of 45 representations objecting to full pedestrianisation of High Street due to delivery access.',
        severity: 'medium',
        type: 'representation',
        relatedObjectIds: ['POL-TC1', 'SITE-002'],
        resolved: false
    }
];
