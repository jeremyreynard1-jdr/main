import { ModuleHeader } from "@/components/ModuleHeader";
import { WorldMap } from "@/components/map/WorldMap";
import { IllustrativeChip } from "@/components/IllustrativeChip";

export default function MapPage() {
  return (
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <ModuleHeader
        eyebrow="Coverage · Geography"
        title="Coverage map"
        subtitle="Where Legora is live, where Harvey is, where we&rsquo;re going next. Real named customers are sourced; targets and launch-stage overlays are illustrative."
        right={<IllustrativeChip note="Pins for public customers are real; targets + stages are mock" />}
      />
      <WorldMap />
    </div>
  );
}
