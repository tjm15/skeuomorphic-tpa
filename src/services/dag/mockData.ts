
import { DagOperations } from './operations';
import { GraphStore } from './GraphStore';
import { NodeType, EdgeType, PlanNodeData, PolicyNodeData, SiteNodeData, EvidenceNodeData, IssueNodeData } from './types';

export function seedRealisticData(store: GraphStore) {
    const ops = new DagOperations(store);

    // --- 1. THE PLAN ---
    const planId = ops.createNode<PlanNodeData>(NodeType.PLAN, {
        title: "Glazebrook Local Plan",
        status: "submission", // Gateway 3
        version: "3.0.0"
    });

    // --- 2. EVIDENCE BASE (The Foundation) ---
    // Key documents that justify the policies
    const eviHna = ops.createNode<EvidenceNodeData>(NodeType.EVI, {
        title: "Housing Needs Assessment 2025",
        documentUrl: "/docs/hna-2025.pdf",
        status: "final"
    });
    const eviSfra = ops.createNode<EvidenceNodeData>(NodeType.EVI, {
        title: "Strategic Flood Risk Assessment Level 1",
        documentUrl: "/docs/sfra-l1.pdf",
        status: "final"
    });
    const eviViability = ops.createNode<EvidenceNodeData>(NodeType.EVI, {
        title: "Whole Plan Viability Assessment",
        documentUrl: "/docs/viability.pdf",
        status: "draft"
    });
    const eviGreenBelt = ops.createNode<EvidenceNodeData>(NodeType.EVI, {
        title: "Green Belt Review (Part 2)",
        documentUrl: "/docs/gb-review.pdf",
        status: "final"
    });

    // --- 3. STRATEGIC POLICIES (Housing Chapter) ---

    // Policy H1: Housing Target
    const polH1 = ops.createNode<PolicyNodeData>(NodeType.POL, {
        code: "H1",
        title: "Housing Requirement",
        text: "Provision will be made for at least **12,500 net additional homes** over the plan period (2025-2040). This will be delivered through...",
        intent: "To meet the objectively assessed housing need as identified in the HNA.",
        status: "draft"
    });
    // Link Evidence: (Evidence, Target, Supports?, Meta)
    ops.linkEvidence(eviHna.id, polH1.id, true, { justification: "Justifies the 12,500 figure" });

    // Policy H2: Affordable Housing
    const polH2 = ops.createNode<PolicyNodeData>(NodeType.POL, {
        code: "H2",
        title: "Affordable Housing Provision",
        text: "Developments of 10 or more dwellings must provide **35% affordable housing**. The tenure split should be 70% Social Rent / 30% First Homes.",
        intent: "To address acute affordability issues in Glazebrook South.",
        status: "draft"
    });
    ops.linkEvidence(eviViability.id, polH2.id, true, { justification: "Confirms 35% is viable across most zones" });

    // Policy H3: Housing Mix
    const polH3 = ops.createNode<PolicyNodeData>(NodeType.POL, {
        code: "H3",
        title: "Housing Mix and Standards",
        text: "New housing should provide a mix of sizes and types... ensuring 10% are accessible M4(3) standard.",
        status: "draft"
    });
    ops.linkEvidence(eviHna.id, polH3.id, true, { justification: "Aligns with demographic aging trends" });

    // Policy H4: Density
    const polH4 = ops.createNode<PolicyNodeData>(NodeType.POL, {
        code: "H4",
        title: "Optimising Density",
        text: "Development in Town Centres must achieve minimum 70 dph. Suburban zones minimum 35 dph.",
        status: "bound" // This one is settled
    });

    // --- 4. SITE ALLOCATIONS ---

    // Site A: The Big One
    const siteA = ops.createNode<SiteNodeData>(NodeType.SITE, {
        code: "SA-01",
        address: "Glazebrook Colliery (Former)",
        areaHa: 45.2,
        capacity: 1200,
        status: "allocated"
    });
    // Site Supports Policy: createEdge(Type, From, To, Meta)
    // SiteA -> PolH1 (SUPPORTS)
    ops.createEdge(EdgeType.SUPPORTS, siteA.id, polH1.id, { justification: "Delivers 10% of total plan requirement" });

    // Site B: Flood Risk Issue
    const siteB = ops.createNode<SiteNodeData>(NodeType.SITE, {
        code: "SA-02",
        address: "Land South of River Glaze",
        areaHa: 12.5,
        capacity: 350,
        status: "candidate"
    });
    ops.createEdge(EdgeType.SUPPORTS, siteB.id, polH1.id, {});

    // Flood risk evidence undermines this site
    // SFRA -> SiteB (UNDERMINES)
    ops.createEdge(EdgeType.UNDERMINES, eviSfra.id, siteB.id, { justification: "Site falls within Zone 3b functional floodplain" });

    // Site C: Green Belt Release
    const siteC = ops.createNode<SiteNodeData>(NodeType.SITE, {
        code: "SA-03",
        address: "North Farm Extension",
        areaHa: 80.0,
        capacity: 2500,
        status: "candidate"
    });
    ops.createEdge(EdgeType.SUPPORTS, siteC.id, polH1.id, {});
    // GB Review -> SiteC (SUPPORTS)
    ops.createEdge(EdgeType.SUPPORTS, eviGreenBelt.id, siteC.id, { justification: "Identified as lower performing parcel" });

    // --- 5. ISSUES & CONTESTATION (The Argument) ---

    // Issue: Flood Risk at Site B
    const issFlood = ops.createNode<IssueNodeData>(NodeType.ISS, {
        title: "Flood Risk Exception Test Failure",
        description: "The EA has objected to SA-02 on grounds that sequential test is not met.",
        severity: "high",
        status: "open"
    });
    // Issue contests Site: Issue -> Site (CONTESTS)
    ops.createEdge(EdgeType.CONTESTS, issFlood.id, siteB.id, {});

    // Issue: Viability of H2
    const issViability = ops.createNode<IssueNodeData>(NodeType.ISS, {
        title: "Developer Challenge to 35% Affordable",
        description: "Consortium of developers argue 35% renders brownfield sites unviable due to remediation costs.",
        severity: "medium",
        status: "open"
    });
    ops.createEdge(EdgeType.CONTESTS, issViability.id, polH2.id, {});

    console.log(`[Glazebrook] Seeded ${store.getAllNodes().length} nodes.`);
}
