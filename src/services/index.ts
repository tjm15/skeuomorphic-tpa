import { MockPlanService } from './MockPlanService';
import { PlanService } from './PlanService';

// Singleton instance for the app
export const planService: PlanService = new MockPlanService(); // Default to mock for now
