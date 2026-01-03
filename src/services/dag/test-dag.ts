
import { GraphStore } from './GraphStore';
import { DagOperations } from './operations';
import { NodeType, EdgeType } from './types';

// Simple Test Runner
async function runTest() {
    console.log('--- PlanState DAG Test ---');

    const store = new GraphStore();
    const ops = new DagOperations(store);

    // 1. Create Root Plan
    console.log('1. Creating Plan Root...');
    const plan = ops.createNode(NodeType.PLAN, { localAuthority: 'Demo Council' }, undefined, 'Local Plan 2030');
    console.log(`   Plan created: ${plan.id}`);

    // 2. Create a Policy
    console.log('2. Creating Policy H1...');
    const policy = ops.createNode(
        NodeType.POL,
        { code: 'H1', text: 'Build 500 homes.', intent: 'Growth' },
        plan.id, // Owned by Plan
        'Housing Policy'
    );
    console.log(`   Policy created: ${policy.id}`);

    // 3. Create Evidence
    console.log('3. Creating Evidence (SHLAA)...');
    const shlaa = ops.createNode(
        NodeType.EVI,
        { source: 'Consultants Ltd', summary: 'Ample capacity found.' },
        plan.id,
        'SHLAA 2025'
    );
    console.log(`   Evidence created: ${shlaa.id}`);

    // 4. Link Evidence -> Policy
    console.log('4. Linking Evidence to Policy...');
    const link = ops.linkEvidence(shlaa.id, policy.id, true);
    console.log(`   Edge created: ${link.id} (${link.type}) ${link.from_id} -> ${link.to_id}`);

    // 5. Supersede Policy (Versioning)
    console.log('5. Superseding Policy H1 (New Version)...');
    const policyV2 = ops.supersedeNode(policy.id, { code: 'H1', text: 'Build 600 homes.', intent: 'Higher Growth' }, 'Updated based on SHLAA');
    console.log(`   Policy V2 created: ${policyV2.id}`);

    // 6. Verify Graph State
    console.log('6. Verifying Graph State...');

    // Check Outbound from V2 (should have supersedes edge to V1)
    const edgesOut = store.getOutboundEdges(policyV2.id, EdgeType.SUPERSEDES);
    console.log(`   V2 Supersedes edges: ${edgesOut.length}`);
    if (edgesOut.length !== 1 || edgesOut[0].to_id !== policy.id) {
        console.error('FAILED: Supersedes edge correct');
    } else {
        console.log('   PASS: V2 -> V1 link correct');
    }

    // Check Inbound to V1 (should be 1 from evidence, 1 from V2)
    const edgesIn = store.getInboundEdges(policy.id);
    console.log(`   V1 Inbound edges: ${edgesIn.length}`);
    edgesIn.forEach(e => console.log(`      - ${e.type} from ${e.from_id}`));

    console.log('--- Test Complete ---');
}

runTest().catch(console.error);
