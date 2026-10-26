import { SiteShell } from "@/components/upbranch/ui/site-shell";
import { RadarExplorer } from "@/components/upbranch/radar/radar-explorer";
import { radarItems } from "@/lib/upbranch/radar/catalog";

export default function RadarPage() {
  return <SiteShell><RadarExplorer items={radarItems} /></SiteShell>;
}
