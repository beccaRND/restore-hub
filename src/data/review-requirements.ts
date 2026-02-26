export interface ReviewRequirement {
  id: string;
  name: string;
  description: string;
  evidenceNeeded: string;
  active: boolean;
}

export const DEFAULT_REQUIREMENTS: ReviewRequirement[] = [
  {
    id: 'REQ-001',
    name: 'Land Ownership or Lease Documentation',
    description: 'Applicant must demonstrate legal access to the land where practices will be implemented.',
    evidenceNeeded: 'Deed, lease agreement, or landowner authorization letter',
    active: true,
  },
  {
    id: 'REQ-002',
    name: 'Farm Operation Plan',
    description: 'A description of the current farming operation including crops, livestock, and management practices.',
    evidenceNeeded: 'Written operation plan or farm description document',
    active: true,
  },
  {
    id: 'REQ-003',
    name: 'Proposed Practice(s) and Acreage',
    description: 'Clear identification of the regenerative practices to be adopted and how many acres they cover.',
    evidenceNeeded: 'Practice implementation plan with acreage breakdown',
    active: true,
  },
  {
    id: 'REQ-004',
    name: 'Budget and Cost Breakdown',
    description: 'Detailed budget showing how grant funds will be spent, including materials, labor, and contractor costs.',
    evidenceNeeded: 'Line-item budget with cost justifications',
    active: true,
  },
  {
    id: 'REQ-005',
    name: 'Soil Baseline Data or Commitment',
    description: 'Existing soil test results or a commitment to collect baseline soil samples before practice implementation.',
    evidenceNeeded: 'Soil test results or signed commitment letter',
    active: true,
  },
  {
    id: 'REQ-006',
    name: 'Environmental Compliance Confirmation',
    description: 'Confirmation that the proposed activities comply with applicable environmental regulations.',
    evidenceNeeded: 'Signed compliance attestation form',
    active: true,
  },
  {
    id: 'REQ-007',
    name: 'Previous Grant History Disclosure',
    description: 'Disclosure of any previous grants received for conservation or agricultural practices.',
    evidenceNeeded: 'List of previous grants with amounts and status',
    active: true,
  },
  {
    id: 'REQ-008',
    name: 'Applicant Eligibility Verification',
    description: 'Verification that the applicant meets program eligibility criteria (farm size, location, entity type).',
    evidenceNeeded: 'Business registration, tax ID, or farm certification',
    active: true,
  },
  {
    id: 'REQ-009',
    name: 'Conservation Practice Timeline',
    description: 'A realistic timeline for implementing the proposed conservation practices.',
    evidenceNeeded: 'Implementation schedule with milestones',
    active: true,
  },
  {
    id: 'REQ-010',
    name: 'Carbon Estimation or COMET Results',
    description: 'Estimated carbon sequestration potential using COMET-Planner or equivalent methodology.',
    evidenceNeeded: 'COMET-Planner output or equivalent carbon estimation report',
    active: true,
  },
  {
    id: 'REQ-011',
    name: 'Letter of Support',
    description: 'A letter from a local NRCS office, Resource Conservation District, or technical assistance provider.',
    evidenceNeeded: 'Signed letter from supporting organization',
    active: false,
  },
  {
    id: 'REQ-012',
    name: 'Water Management Plan',
    description: 'Plan for water use and conservation as part of the proposed practices.',
    evidenceNeeded: 'Water management plan or irrigation schedule',
    active: false,
  },
];
