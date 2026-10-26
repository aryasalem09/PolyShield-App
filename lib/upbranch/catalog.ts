import { missions } from './content/missions';
import { bounties } from './bounties/catalog';
import { pathways } from './pathways/catalog';
import { radarItems } from './radar/catalog';
import type { Mission, Pathway, Bounty, RadarItem } from './contracts';

export function listPublishedMissions(): Mission[] { return missions.filter((mission) => mission.published); }
export function getMission(id: string): Mission | undefined { return missions.find((mission) => mission.id === id); }
export function listPathways(): Pathway[] { return pathways; }
export function listBounties(): Bounty[] { return bounties; }
export function listRadarItems(): RadarItem[] { return radarItems; }
