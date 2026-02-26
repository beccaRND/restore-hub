export type ReviewStatus = 'satisfied' | 'partial' | 'missing' | 'needs_review';
export type Confidence = 'high' | 'medium' | 'low';
export type ApplicationStatus = 'pending' | 'ai_reviewed' | 'human_verified' | 'approved' | 'rejected';

export interface RequirementReview {
  requirementId: string;
  status: ReviewStatus;
  evidence: string;
  sourceDocument: string;
  issues: string[];
  confidence: Confidence;
}

export interface UploadedDocument {
  name: string;
  type: 'pdf' | 'docx' | 'csv' | 'xlsx';
  size: string;
  uploadedAt: string;
}

export interface ApplicationReview {
  id: string;
  applicantName: string;
  farmName: string;
  location: { state: string; county: string };
  acreage: number;
  practices: string[];
  grantAmountRequested: number;
  program: string;
  documents: UploadedDocument[];
  requirementReviews: RequirementReview[];
  status: ApplicationStatus;
  coverageScore: number;
  totalRequirements: number;
  satisfiedCount: number;
  submittedDate: string;
}

/**
 * Mock AI review function — returns pre-populated data.
 * In production, this would call an LLM API to analyze uploaded documents.
 */
export function reviewApplication(applicationId: string): ApplicationReview | undefined {
  return MOCK_APPLICATIONS.find((a) => a.id === applicationId);
}

export const MOCK_APPLICATIONS: ApplicationReview[] = [
  {
    id: 'app-001',
    applicantName: 'Maria Gonzalez',
    farmName: 'Salinas Valley Organic Farms',
    location: { state: 'CA', county: 'Monterey' },
    acreage: 320,
    practices: ['Compost Application', 'Cover Cropping'],
    grantAmountRequested: 24000,
    program: 'Restore California',
    documents: [
      { name: 'SalinasValley_Application.pdf', type: 'pdf', size: '2.4 MB', uploadedAt: '2025-11-02' },
      { name: 'FarmOperationPlan_2025.pdf', type: 'pdf', size: '1.1 MB', uploadedAt: '2025-11-02' },
      { name: 'Budget_Breakdown.xlsx', type: 'xlsx', size: '340 KB', uploadedAt: '2025-11-02' },
      { name: 'SoilTest_Results_Oct2025.pdf', type: 'pdf', size: '580 KB', uploadedAt: '2025-11-03' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'satisfied', evidence: 'Lease agreement for 320 acres in Monterey County attached as Appendix A of the application document, valid through 2030.', sourceDocument: 'SalinasValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Detailed farm operation plan describes current organic lettuce and strawberry production across 320 acres with 3 full-time employees.', sourceDocument: 'FarmOperationPlan_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Proposes compost application on 200 acres and cover cropping on 320 acres. Practice map included on page 4.', sourceDocument: 'SalinasValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'satisfied', evidence: 'Line-item budget totaling $24,000: compost materials ($14,000), cover crop seed ($4,500), labor ($3,500), soil testing ($2,000).', sourceDocument: 'Budget_Breakdown.xlsx', issues: [], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'satisfied', evidence: 'Soil baseline tests from October 2025 included. Samples from 8 locations across the farm. Shows SOC at 1.8% average.', sourceDocument: 'SoilTest_Results_Oct2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Signed environmental compliance attestation on page 12 of the application.', sourceDocument: 'SalinasValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'satisfied', evidence: 'Disclosed CDFA HSP grant of $8,000 received in 2022 for irrigation efficiency. Status: completed.', sourceDocument: 'SalinasValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Farm registered as LLC in California. Tax ID and organic certification number provided.', sourceDocument: 'SalinasValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'satisfied', evidence: 'Implementation timeline spans 18 months: Q1 2026 soil prep, Q2 2026 compost application, Q3 2026 cover crop seeding.', sourceDocument: 'FarmOperationPlan_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-010', status: 'satisfied', evidence: 'COMET-Planner results estimate 460-740 tCO2e over the crediting period. Report attached as Appendix C.', sourceDocument: 'SalinasValley_Application.pdf', issues: [], confidence: 'high' },
    ],
    status: 'human_verified',
    coverageScore: 100,
    totalRequirements: 10,
    satisfiedCount: 10,
    submittedDate: '2025-11-02',
  },
  {
    id: 'app-002',
    applicantName: 'James & Patricia Chen',
    farmName: 'Willamette Valley Regenerative',
    location: { state: 'OR', county: 'Yamhill' },
    acreage: 180,
    practices: ['Cover Cropping', 'Reduced Tillage', 'Hedgerow Planting'],
    grantAmountRequested: 18500,
    program: 'Restore Oregon',
    documents: [
      { name: 'WillametteValley_App_2025.pdf', type: 'pdf', size: '3.1 MB', uploadedAt: '2025-11-05' },
      { name: 'Chen_Budget.csv', type: 'csv', size: '45 KB', uploadedAt: '2025-11-05' },
      { name: 'LeaseAgreement_Chen.pdf', type: 'pdf', size: '890 KB', uploadedAt: '2025-11-05' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'satisfied', evidence: 'Lease agreement uploaded separately. 10-year lease for 180 acres in Yamhill County, signed by both parties.', sourceDocument: 'LeaseAgreement_Chen.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Operation plan describes mixed vegetable and grain operation, transitioning from conventional to regenerative over 3 years.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Cover cropping on 180 acres, reduced tillage on 120 acres, hedgerow planting along 2.5 miles of field borders.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'partial', evidence: 'Budget provided as CSV but missing labor cost details. Total shows $18,500 but line items only sum to $15,200.', sourceDocument: 'Chen_Budget.csv', issues: ['Budget line items do not sum to requested amount — $3,300 gap unaccounted for.'], confidence: 'medium' },
      { requirementId: 'REQ-005', status: 'missing', evidence: 'No soil test results provided. Application mentions "plan to collect baseline samples in spring 2026" but no formal commitment letter.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: ['No soil baseline data and no signed commitment to collect.'], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance form signed and notarized, page 8 of application.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'satisfied', evidence: 'No previous grants disclosed. Signed attestation that this is the first conservation grant application.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: [], confidence: 'medium' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Joint ownership documented. Farm registered in Oregon, tax ID provided.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'satisfied', evidence: 'Timeline: cover crops planted fall 2026, reduced tillage starting spring 2026, hedgerows planted spring 2027.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-010', status: 'needs_review', evidence: 'COMET estimate referenced but the actual report file was not uploaded. Application states "420 tCO2e estimated" without supporting documentation.', sourceDocument: 'WillametteValley_App_2025.pdf', issues: ['COMET-Planner report not attached — only a summary number referenced in text.'], confidence: 'low' },
    ],
    status: 'ai_reviewed',
    coverageScore: 70,
    totalRequirements: 10,
    satisfiedCount: 7,
    submittedDate: '2025-11-05',
  },
  {
    id: 'app-003',
    applicantName: 'Robert Whitehorse',
    farmName: 'Front Range Bison Ranch',
    location: { state: 'CO', county: 'Weld' },
    acreage: 640,
    practices: ['Managed Grazing', 'Compost Application'],
    grantAmountRequested: 32000,
    program: 'Restore Colorado',
    documents: [
      { name: 'FrontRange_Grant_Application.pdf', type: 'pdf', size: '4.2 MB', uploadedAt: '2025-11-08' },
      { name: 'GrazingPlan_2025.docx', type: 'docx', size: '1.8 MB', uploadedAt: '2025-11-08' },
      { name: 'WeldCounty_Deed.pdf', type: 'pdf', size: '620 KB', uploadedAt: '2025-11-08' },
      { name: 'COMET_Report_FrontRange.pdf', type: 'pdf', size: '290 KB', uploadedAt: '2025-11-09' },
      { name: 'SoilBaseline_Weld.pdf', type: 'pdf', size: '410 KB', uploadedAt: '2025-11-09' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'satisfied', evidence: 'Property deed for 640 acres in Weld County uploaded. Owned outright by applicant since 2018.', sourceDocument: 'WeldCounty_Deed.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Bison ranching operation detailed in grazing plan. Currently runs 85 head on adaptive multi-paddock system.', sourceDocument: 'GrazingPlan_2025.docx', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Managed grazing on 500 acres, compost application on 140 acres of hay meadows. Map on page 6 of application.', sourceDocument: 'FrontRange_Grant_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'satisfied', evidence: 'Budget: compost procurement and spreading ($18,000), fencing for rotational grazing ($8,000), water infrastructure ($4,000), soil testing ($2,000).', sourceDocument: 'FrontRange_Grant_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'satisfied', evidence: 'Soil samples from 12 locations taken September 2025. SOC ranges from 1.2% to 2.4%. Full lab report attached.', sourceDocument: 'SoilBaseline_Weld.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance attestation signed. Notes compliance with Colorado water quality regulations.', sourceDocument: 'FrontRange_Grant_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'needs_review', evidence: 'Mentions receiving a "USDA EQIP payment" but does not disclose the amount or year. Reviewer should verify with NRCS records.', sourceDocument: 'FrontRange_Grant_Application.pdf', issues: ['EQIP payment mentioned but not fully disclosed — amount and dates missing.'], confidence: 'low' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Sole proprietorship. Colorado farm registration and tax ID confirmed on page 2.', sourceDocument: 'FrontRange_Grant_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'satisfied', evidence: 'Phased 24-month timeline: fencing Q1-Q2 2026, grazing rotation begins Q3 2026, compost application fall 2026 and spring 2027.', sourceDocument: 'FrontRange_Grant_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-010', status: 'satisfied', evidence: 'COMET-Planner results show 880-1,400 tCO2e estimated over 10 years. Full report uploaded separately.', sourceDocument: 'COMET_Report_FrontRange.pdf', issues: [], confidence: 'high' },
    ],
    status: 'ai_reviewed',
    coverageScore: 90,
    totalRequirements: 10,
    satisfiedCount: 9,
    submittedDate: '2025-11-08',
  },
  {
    id: 'app-004',
    applicantName: 'Sarah Clearwater',
    farmName: 'Cascade Foothills Farm',
    location: { state: 'WA', county: 'Thurston' },
    acreage: 95,
    practices: ['Cover Cropping', 'Compost Application', 'Nutrient Management'],
    grantAmountRequested: 12000,
    program: 'Restore Northwest',
    documents: [
      { name: 'CascadeFoothills_Application.pdf', type: 'pdf', size: '1.9 MB', uploadedAt: '2025-11-10' },
      { name: 'Budget_CascadeFoothills.pdf', type: 'pdf', size: '220 KB', uploadedAt: '2025-11-10' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'partial', evidence: 'Application mentions land ownership but no deed or lease documentation was uploaded. States "own 95 acres" in narrative.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: ['No supporting ownership documentation attached.'], confidence: 'medium' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Mixed vegetable operation with berry production. 12 years of farming experience described in Section 2.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Cover cropping on 60 acres, compost on 40 acres, nutrient management plan for full 95 acres.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'satisfied', evidence: 'Budget totals $12,000: cover crop seed ($3,200), compost ($5,800), nutrient testing and management ($2,000), misc ($1,000).', sourceDocument: 'Budget_CascadeFoothills.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'missing', evidence: 'No soil data provided and no commitment to collect baseline mentioned anywhere in the application.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: ['No soil baseline data or commitment letter found in any submitted documents.'], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance form signed on page 9.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'satisfied', evidence: 'Disclosed WSU Extension micro-grant of $2,500 in 2023. Status: completed successfully.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Individual farmer. Washington State farm registration number and EIN provided.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'partial', evidence: 'States "implementation will begin spring 2026" but lacks specific quarterly milestones or detailed timeline.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: ['Timeline is vague — no specific milestone dates or quarterly breakdown.'], confidence: 'medium' },
      { requirementId: 'REQ-010', status: 'missing', evidence: 'No carbon estimation or COMET results included. Application does not reference any carbon modeling.', sourceDocument: 'CascadeFoothills_Application.pdf', issues: ['No carbon estimation or COMET analysis provided.'], confidence: 'high' },
    ],
    status: 'ai_reviewed',
    coverageScore: 60,
    totalRequirements: 10,
    satisfiedCount: 6,
    submittedDate: '2025-11-10',
  },
  {
    id: 'app-005',
    applicantName: 'Diego & Elena Ramirez',
    farmName: 'Sol y Tierra Vineyard',
    location: { state: 'CA', county: 'San Luis Obispo' },
    acreage: 85,
    practices: ['Compost Application', 'Cover Cropping', 'Hedgerow Planting'],
    grantAmountRequested: 15000,
    program: 'Restore California',
    documents: [
      { name: 'SolYTierra_FullApplication.pdf', type: 'pdf', size: '5.6 MB', uploadedAt: '2025-11-12' },
      { name: 'Vineyard_Budget_2026.xlsx', type: 'xlsx', size: '180 KB', uploadedAt: '2025-11-12' },
      { name: 'COMET_Vineyard_Results.pdf', type: 'pdf', size: '340 KB', uploadedAt: '2025-11-12' },
      { name: 'SoilTests_SLO_2025.pdf', type: 'pdf', size: '720 KB', uploadedAt: '2025-11-12' },
      { name: 'PropertyDeed_Ramirez.pdf', type: 'pdf', size: '1.1 MB', uploadedAt: '2025-11-12' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'satisfied', evidence: 'Property deed uploaded showing 85-acre vineyard in San Luis Obispo County. Owned by Diego & Elena Ramirez since 2019.', sourceDocument: 'PropertyDeed_Ramirez.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Comprehensive operation plan covering wine grape production (Pinot Noir, Chardonnay) on 65 acres with 20 acres in transition.', sourceDocument: 'SolYTierra_FullApplication.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Compost application between vine rows on 65 acres, cover cropping on all 85 acres, hedgerow planting on 0.8 miles.', sourceDocument: 'SolYTierra_FullApplication.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'satisfied', evidence: 'Detailed budget: compost ($7,500), cover crop seed ($2,800), hedgerow plants and installation ($3,200), soil testing ($1,500).', sourceDocument: 'Vineyard_Budget_2026.xlsx', issues: [], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'satisfied', evidence: 'Soil samples from 6 vineyard blocks taken August 2025. SOC ranging from 1.5% to 2.1%. Includes detailed nutrient analysis.', sourceDocument: 'SoilTests_SLO_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance and organic certification compliance confirmed. Signed attestation on page 14.', sourceDocument: 'SolYTierra_FullApplication.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'satisfied', evidence: 'Disclosed NRCS EQIP payment of $6,000 in 2021 for drip irrigation. Status: successfully completed.', sourceDocument: 'SolYTierra_FullApplication.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Family LLC registered in California. Wine business license and tax ID provided on page 3.', sourceDocument: 'SolYTierra_FullApplication.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'satisfied', evidence: '12-month timeline: hedgerow planting Jan-Mar 2026, cover crops Apr 2026, compost application May-Jun 2026, monitoring ongoing.', sourceDocument: 'SolYTierra_FullApplication.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-010', status: 'satisfied', evidence: 'COMET-Planner report attached showing 180-310 tCO2e over 10 years for the combined practice suite.', sourceDocument: 'COMET_Vineyard_Results.pdf', issues: [], confidence: 'high' },
    ],
    status: 'approved',
    coverageScore: 100,
    totalRequirements: 10,
    satisfiedCount: 10,
    submittedDate: '2025-11-12',
  },
  {
    id: 'app-006',
    applicantName: 'Tom Blackwell',
    farmName: 'High Plains Wheat Co-op',
    location: { state: 'CO', county: 'Kit Carson' },
    acreage: 1200,
    practices: ['Reduced Tillage', 'Cover Cropping'],
    grantAmountRequested: 45000,
    program: 'Restore Colorado',
    documents: [
      { name: 'HighPlains_Application.pdf', type: 'pdf', size: '2.8 MB', uploadedAt: '2025-11-14' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'needs_review', evidence: 'Application mentions co-op structure with multiple landowners. Individual land documentation not provided — only a co-op membership roster.', sourceDocument: 'HighPlains_Application.pdf', issues: ['Co-op structure may need individual landowner authorizations for each parcel.'], confidence: 'low' },
      { requirementId: 'REQ-002', status: 'partial', evidence: 'Describes wheat production broadly but lacks specifics about current management practices and rotation schedule.', sourceDocument: 'HighPlains_Application.pdf', issues: ['Farm operation description is too general — lacks specific crop rotation and management details.'], confidence: 'medium' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Reduced tillage on 800 acres, cover cropping on 1,200 acres. Practice areas clearly mapped in Section 4.', sourceDocument: 'HighPlains_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'missing', evidence: 'No budget document provided. Application mentions "$45,000 requested" but no line-item breakdown.', sourceDocument: 'HighPlains_Application.pdf', issues: ['No budget breakdown — only a lump sum request with no cost justification.'], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'missing', evidence: 'No soil data provided. No mention of plans to collect baseline samples.', sourceDocument: 'HighPlains_Application.pdf', issues: ['No soil baseline data or commitment to collect.'], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance attestation signed by co-op director on page 10.', sourceDocument: 'HighPlains_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'missing', evidence: 'Previous grant history section left blank. Unknown if this is "no prior grants" or an omission.', sourceDocument: 'HighPlains_Application.pdf', issues: ['Grant history section blank — unclear if intentional or oversight.'], confidence: 'low' },
      { requirementId: 'REQ-008', status: 'needs_review', evidence: 'Co-op registered as entity but individual eligibility of member farms not verified.', sourceDocument: 'HighPlains_Application.pdf', issues: ['Co-op eligibility vs individual farm eligibility needs clarification.'], confidence: 'low' },
      { requirementId: 'REQ-009', status: 'partial', evidence: 'General timeline says "Year 1: reduced tillage transition, Year 2: full cover crop program" — lacks quarterly milestones.', sourceDocument: 'HighPlains_Application.pdf', issues: ['Timeline too high-level — needs quarterly milestones for a $45K grant.'], confidence: 'medium' },
      { requirementId: 'REQ-010', status: 'missing', evidence: 'No COMET results or carbon estimates anywhere in the application.', sourceDocument: 'HighPlains_Application.pdf', issues: ['No carbon estimation provided.'], confidence: 'high' },
    ],
    status: 'ai_reviewed',
    coverageScore: 30,
    totalRequirements: 10,
    satisfiedCount: 3,
    submittedDate: '2025-11-14',
  },
  {
    id: 'app-007',
    applicantName: 'Linda Park',
    farmName: 'Sonoma Hills Dairy',
    location: { state: 'CA', county: 'Sonoma' },
    acreage: 220,
    practices: ['Compost Application', 'Silvopasture', 'Managed Grazing'],
    grantAmountRequested: 28000,
    program: 'Restore California',
    documents: [
      { name: 'SonomaHills_Application.pdf', type: 'pdf', size: '3.8 MB', uploadedAt: '2025-11-15' },
      { name: 'DairyOperationPlan.pdf', type: 'pdf', size: '1.4 MB', uploadedAt: '2025-11-15' },
      { name: 'Budget_SonomaDairy.xlsx', type: 'xlsx', size: '210 KB', uploadedAt: '2025-11-15' },
      { name: 'Sonoma_SoilResults.pdf', type: 'pdf', size: '480 KB', uploadedAt: '2025-11-16' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'satisfied', evidence: 'Property deed showing 220-acre dairy in Sonoma County. Family-owned since 1987.', sourceDocument: 'SonomaHills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Dairy operation plan describes 120 Holstein cows, pasture rotation, and current feed crop production.', sourceDocument: 'DairyOperationPlan.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Compost on 100 acres of pasture, silvopasture on 40 acres, managed grazing on 180 acres.', sourceDocument: 'SonomaHills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'satisfied', evidence: 'Budget: compost ($12,000), tree planting for silvopasture ($8,000), fencing ($5,000), monitoring ($3,000).', sourceDocument: 'Budget_SonomaDairy.xlsx', issues: [], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'satisfied', evidence: 'Comprehensive soil baseline from July 2025. 10 sample locations. Average SOC 2.6% — good starting point.', sourceDocument: 'Sonoma_SoilResults.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance signed. Also notes compliance with dairy-specific RWQCB regulations.', sourceDocument: 'SonomaHills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'satisfied', evidence: 'CDFA DDRDP grant of $15,000 in 2020 for methane digester feasibility. Fully completed.', sourceDocument: 'SonomaHills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Family corporation registered in California. Dairy license and permits current.', sourceDocument: 'SonomaHills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'satisfied', evidence: 'Detailed 24-month plan: tree planting Q1 2026, compost Q2 2026, grazing rotation Q3 2026, monitoring quarterly.', sourceDocument: 'SonomaHills_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-010', status: 'partial', evidence: 'COMET results mentioned ("estimated 350-580 tCO2e") but full report not attached. Only summary numbers in narrative.', sourceDocument: 'SonomaHills_Application.pdf', issues: ['COMET report not uploaded — only summary estimates in application text.'], confidence: 'medium' },
    ],
    status: 'ai_reviewed',
    coverageScore: 90,
    totalRequirements: 10,
    satisfiedCount: 9,
    submittedDate: '2025-11-15',
  },
  {
    id: 'app-008',
    applicantName: 'Mark & Susan Olsen',
    farmName: 'Rogue Valley Orchards',
    location: { state: 'OR', county: 'Jackson' },
    acreage: 45,
    practices: ['Compost Application', 'Cover Cropping'],
    grantAmountRequested: 8500,
    program: 'Restore Oregon',
    documents: [
      { name: 'RogueValley_Application.pdf', type: 'pdf', size: '1.6 MB', uploadedAt: '2025-11-18' },
      { name: 'Olsen_Budget.pdf', type: 'pdf', size: '150 KB', uploadedAt: '2025-11-18' },
      { name: 'OrchardSoilTest_2025.pdf', type: 'pdf', size: '380 KB', uploadedAt: '2025-11-18' },
    ],
    requirementReviews: [
      { requirementId: 'REQ-001', status: 'satisfied', evidence: 'Property deed for 45 acres. Owned by Mark & Susan Olsen since 2005. Pear and apple orchard.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-002', status: 'satisfied', evidence: 'Organic pear and apple orchard, 30 acres in production with 15 acres being rehabilitated.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-003', status: 'satisfied', evidence: 'Compost on 30 acres of orchard floor, cover cropping between tree rows on 30 acres.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-004', status: 'satisfied', evidence: 'Budget: compost ($4,500), cover crop seed ($1,500), spreading equipment rental ($1,500), soil testing ($1,000).', sourceDocument: 'Olsen_Budget.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-005', status: 'satisfied', evidence: 'Soil tests from 4 orchard blocks. SOC 2.0-2.8%. Good baseline with nutrient analysis included.', sourceDocument: 'OrchardSoilTest_2025.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-006', status: 'satisfied', evidence: 'Environmental compliance signed. Organic certification noted as additional compliance layer.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-007', status: 'satisfied', evidence: 'No previous conservation grants. First-time applicant attestation signed.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-008', status: 'satisfied', evidence: 'Joint ownership. Oregon farm registration and tax documentation included.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-009', status: 'satisfied', evidence: '12-month plan: soil prep Jan 2026, compost application Feb-Mar 2026, cover crop seeding Apr 2026, monitoring Sep 2026.', sourceDocument: 'RogueValley_Application.pdf', issues: [], confidence: 'high' },
      { requirementId: 'REQ-010', status: 'missing', evidence: 'No COMET results or carbon estimates provided. Small orchard may not have used COMET-Planner.', sourceDocument: 'RogueValley_Application.pdf', issues: ['No carbon estimation — should be requested even for small acreage.'], confidence: 'high' },
    ],
    status: 'pending',
    coverageScore: 90,
    totalRequirements: 10,
    satisfiedCount: 9,
    submittedDate: '2025-11-18',
  },
];
