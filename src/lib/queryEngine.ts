import type { FarmProject } from '../types/project';
import type { Funder } from '../types/funder';
import { PRACTICE_LABELS, FUND_SOURCE_LABELS } from '../types/project';
import type { PracticeType } from '../types/project';
import { formatNumber, formatCurrency, formatCarbonRange, carbonToCars, carbonToTrees } from './formatters';

export interface QueryResult {
  answer: string;
  sources: string[];
  type: 'data' | 'narrative' | 'list';
  suggestedActions?: { label: string; action: string }[];
}

// Simple keyword-based local query engine
// In production, this routes to Regen KOI MCP for semantic search
export function processQuery(
  query: string,
  projects: FarmProject[],
  funders: Funder[]
): QueryResult {
  const q = query.toLowerCase().trim();

  // State-specific queries
  const stateMatch = q.match(/(?:in|for|across)\s+(california|ca|colorado|co|oregon|or|washington|wa|new\s*york|ny)/i);
  if (stateMatch || q.match(/how many projects/i)) {
    const stateMap: Record<string, string> = {
      california: 'CA', ca: 'CA',
      colorado: 'CO', co: 'CO',
      oregon: 'OR', or: 'OR',
      washington: 'WA', wa: 'WA',
      'new york': 'NY', ny: 'NY',
    };

    if (stateMatch) {
      const stateKey = stateMatch[1].toLowerCase().replace(/\s+/g, ' ');
      const stateCode = stateMap[stateKey] || stateMatch[1].toUpperCase();
      const stateProjects = projects.filter((p) => p.location.state === stateCode);
      const totalAcres = stateProjects.reduce((s, p) => s + p.acreage, 0);
      const totalGrants = stateProjects.reduce((s, p) => s + p.grantAmount, 0);
      const available = stateProjects.filter((p) => p.availability === 'available').length;

      return {
        answer: `**${stateCode} Projects Overview**\n\n` +
          `- **${stateProjects.length}** total projects (${available} available)\n` +
          `- **${formatNumber(totalAcres)}** total acres\n` +
          `- **${formatCurrency(totalGrants)}** in grants deployed\n` +
          `- Top practices: ${getTopPractices(stateProjects, 3)}`,
        sources: [`${stateProjects.length} projects in demo dataset`],
        type: 'data',
      };
    }

    // General "how many projects"
    const byState = groupByState(projects);
    const lines = Object.entries(byState)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([state, projs]) => `- **${state}**: ${projs.length} projects`);

    return {
      answer: `**Project Count by State**\n\n${lines.join('\n')}\n\n**Total: ${projects.length} projects**`,
      sources: ['Demo project dataset'],
      type: 'data',
    };
  }

  // Carbon/impact queries
  if (q.match(/carbon|impact|co2|sequester|estimate/i)) {
    const totalCarbonLow = projects.reduce((s, p) => s + p.cometEstimate.low, 0);
    const totalCarbonHigh = projects.reduce((s, p) => s + p.cometEstimate.high, 0);
    const avgCarbon = (totalCarbonLow + totalCarbonHigh) / 2;

    return {
      answer: `**Total Carbon Impact Estimates**\n\n` +
        `- **${formatCarbonRange(totalCarbonLow, totalCarbonHigh)}** total estimated sequestration\n` +
        `- Equivalent to **${formatNumber(carbonToCars(avgCarbon))} cars** removed from the road for a year\n` +
        `- Equivalent to **${formatNumber(carbonToTrees(avgCarbon))} trees** planted and grown for 10 years\n\n` +
        `*Note: These are COMET Planner estimates shown as ranges to reflect inherent uncertainty in soil carbon modeling.*`,
      sources: ['COMET Planner estimates from demo dataset'],
      type: 'data',
    };
  }

  // Practice queries
  if (q.match(/practice|common|popular|compost|cover crop|grazing/i)) {
    const practiceCount: Record<string, number> = {};
    projects.forEach((p) =>
      p.practices.forEach((pr) => {
        practiceCount[pr] = (practiceCount[pr] || 0) + 1;
      })
    );
    const sorted = Object.entries(practiceCount)
      .sort((a, b) => b[1] - a[1])
      .map(([p, count]) => `- **${PRACTICE_LABELS[p as PracticeType]}**: ${count} projects (${Math.round((count / projects.length) * 100)}%)`);

    return {
      answer: `**Practice Frequency Across All Projects**\n\n${sorted.join('\n')}`,
      sources: ['Demo project dataset'],
      type: 'data',
    };
  }

  // Compost-specific
  if (q.match(/compost.*(project|over|acre|50)/i)) {
    const compostProjects = projects.filter((p) =>
      p.practices.includes('compost_application') && (q.match(/50\s*acre/i) ? p.acreage > 50 : true)
    );
    const lines = compostProjects
      .sort((a, b) => b.acreage - a.acreage)
      .slice(0, 10)
      .map((p) => `- **${p.farmName}** (${p.location.county}, ${p.location.state}) — ${formatNumber(p.acreage)} acres`);

    return {
      answer: `**Compost Application Projects${q.match(/50/i) ? ' Over 50 Acres' : ''}**\n\nFound ${compostProjects.length} projects:\n\n${lines.join('\n')}` +
        (compostProjects.length > 10 ? `\n\n*...and ${compostProjects.length - 10} more*` : ''),
      sources: ['Demo project dataset'],
      type: 'list',
    };
  }

  // Funder-specific queries
  const funderMatch = funders.find((f) =>
    q.includes(f.name.toLowerCase()) || q.includes(f.slug.replace(/-/g, ' '))
  );
  if (funderMatch || q.match(/funder|partner|bob|kind|whole\s*food|season|tillamook/i)) {
    if (funderMatch) {
      return {
        answer: `**${funderMatch.name} — Impact Summary**\n\n` +
          `- Partner since ${funderMatch.partnerSince.slice(0, 7)}\n` +
          `- **${formatCurrency(funderMatch.contributionTotal)}** total contribution\n` +
          `- **${funderMatch.projectsSupported}** projects supported across **${formatNumber(funderMatch.acresImpacted)}** acres\n` +
          `- Regions: ${funderMatch.regions.join(', ')}\n` +
          `- Est. carbon impact: **${formatCarbonRange(funderMatch.collectiveImpact.estimatedCarbonLow, funderMatch.collectiveImpact.estimatedCarbonHigh)}**`,
        sources: ['Funder dataset'],
        type: 'data',
        suggestedActions: [
          { label: 'View full story', action: `/stories/${funderMatch.slug}` },
        ],
      };
    }

    // List all funders
    const lines = funders.map((f) =>
      `- **${f.name}**: ${formatCurrency(f.contributionTotal)} — ${f.projectsSupported} projects`
    );
    return {
      answer: `**Corporate Partners**\n\n${lines.join('\n')}`,
      sources: ['Funder dataset'],
      type: 'list',
    };
  }

  // Grant/funding queries
  if (q.match(/grant|fund|money|deploy|budget/i)) {
    const totalGrants = projects.reduce((s, p) => s + p.grantAmount, 0);
    const avgGrant = totalGrants / projects.length;
    const bySource: Record<string, { count: number; total: number }> = {};
    projects.forEach((p) => {
      if (!bySource[p.fundSource]) bySource[p.fundSource] = { count: 0, total: 0 };
      bySource[p.fundSource].count++;
      bySource[p.fundSource].total += p.grantAmount;
    });
    const lines = Object.entries(bySource)
      .sort((a, b) => b[1].total - a[1].total)
      .map(([source, data]) => `- **${FUND_SOURCE_LABELS[source as keyof typeof FUND_SOURCE_LABELS]}**: ${formatCurrency(data.total)} across ${data.count} projects`);

    return {
      answer: `**Grant Deployment Summary**\n\n` +
        `- **${formatCurrency(totalGrants)}** total grants deployed\n` +
        `- **${formatCurrency(avgGrant)}** average grant size\n` +
        `- **${projects.length}** projects funded\n\n` +
        `**By Fund Source:**\n${lines.join('\n')}`,
      sources: ['Demo project dataset'],
      type: 'data',
    };
  }

  // Availability queries
  if (q.match(/available|availability|listed|private|conversation/i)) {
    const available = projects.filter((p) => p.availability === 'available').length;
    const inConvo = projects.filter((p) => p.availability === 'in_conversation').length;
    const committed = projects.filter((p) => p.availability === 'committed').length;
    const priv = projects.filter((p) => p.availability === 'private').length;

    return {
      answer: `**Project Availability**\n\n` +
        `- **${available}** Available — open for engagement\n` +
        `- **${inConvo}** In Conversation — buyer interest expressed\n` +
        `- **${committed}** Committed — under agreement\n` +
        `- **${priv}** Private — farmer opted out\n\n` +
        `**${Math.round((available / projects.length) * 100)}%** of projects are currently available.`,
      sources: ['Demo project dataset'],
      type: 'data',
    };
  }

  // Default: general summary
  const totalAcres = projects.reduce((s, p) => s + p.acreage, 0);
  const totalGrants = projects.reduce((s, p) => s + p.grantAmount, 0);

  return {
    answer: `I can help you explore ZFP's data. Here's a quick overview:\n\n` +
      `- **${projects.length}** farm projects across **${new Set(projects.map((p) => p.location.state)).size}** states\n` +
      `- **${formatNumber(totalAcres)}** total acres in program\n` +
      `- **${formatCurrency(totalGrants)}** deployed in grants\n` +
      `- **${funders.length}** corporate partners\n\n` +
      `Try asking about specific states, practices, funders, carbon impact, or project availability.`,
    sources: ['Demo dataset'],
    type: 'data',
  };
}

function groupByState(projects: FarmProject[]): Record<string, FarmProject[]> {
  return projects.reduce<Record<string, FarmProject[]>>((acc, p) => {
    if (!acc[p.location.state]) acc[p.location.state] = [];
    acc[p.location.state].push(p);
    return acc;
  }, {});
}

function getTopPractices(projects: FarmProject[], n: number): string {
  const counts: Record<string, number> = {};
  projects.forEach((p) => p.practices.forEach((pr) => { counts[pr] = (counts[pr] || 0) + 1; }));
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, n)
    .map(([p]) => PRACTICE_LABELS[p as PracticeType])
    .join(', ');
}
