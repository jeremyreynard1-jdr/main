"use client";

import { useMemo, useState } from "react";
import {
  ComposableMap,
  Geographies,
  Geography,
  Marker,
} from "react-simple-maps";
import { customers, type Customer } from "@/src/data/customers";
import { targets, type Target } from "@/src/data/targets";
import { cn } from "@/lib/cn";

// Lightweight TopoJSON sourced from react-simple-maps examples / naturalearthdata
const geoUrl =
  "https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json";

type Region = "all" | "NA" | "UK" | "EU" | "APAC" | "ME" | "AU";
type Overlay = "both" | "legora" | "harvey";
type Layer = "customers" | "targets" | "all";

const regionProjections: Record<
  Region,
  { center: [number, number]; scale: number }
> = {
  all: { center: [10, 25], scale: 130 },
  NA: { center: [-95, 40], scale: 420 },
  UK: { center: [-1.5, 54], scale: 1400 },
  EU: { center: [10, 50], scale: 620 },
  APAC: { center: [130, 20], scale: 360 },
  ME: { center: [45, 28], scale: 700 },
  AU: { center: [140, -25], scale: 600 },
};

const regionLabels: { value: Region; label: string }[] = [
  { value: "all", label: "World" },
  { value: "NA", label: "North America" },
  { value: "UK", label: "UK" },
  { value: "EU", label: "Europe" },
  { value: "APAC", label: "APAC" },
  { value: "ME", label: "MENA" },
  { value: "AU", label: "Australia" },
];

export function WorldMap() {
  const [region, setRegion] = useState<Region>("all");
  const [overlay, setOverlay] = useState<Overlay>("both");
  const [layer, setLayer] = useState<Layer>("all");
  const [hover, setHover] = useState<
    | { kind: "customer"; c: Customer }
    | { kind: "target"; t: Target }
    | null
  >(null);

  const projection = regionProjections[region];

  const visibleCustomers = useMemo(
    () =>
      customers.filter((c) => {
        if (overlay === "legora" && c.vendor !== "legora") return false;
        if (overlay === "harvey" && c.vendor !== "harvey") return false;
        if (layer === "targets") return false;
        return true;
      }),
    [overlay, layer]
  );

  const visibleTargets = useMemo(
    () => (layer === "customers" ? [] : targets),
    [layer]
  );

  return (
    <section className="mt-10">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {regionLabels.map((r) => (
            <button
              key={r.value}
              onClick={() => setRegion(r.value)}
              className={cn(
                "rounded-full px-3 py-1 text-[11.5px] font-medium transition",
                region === r.value
                  ? "bg-bg-alt text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="ml-auto flex gap-1 rounded-full border border-border bg-surface p-1">
          {(["both", "legora", "harvey"] as Overlay[]).map((o) => (
            <button
              key={o}
              onClick={() => setOverlay(o)}
              className={cn(
                "rounded-full px-3 py-1 text-[11.5px] font-medium capitalize transition",
                overlay === o
                  ? "bg-bg-alt text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {o === "both" ? "Both vendors" : o}
            </button>
          ))}
        </div>

        <div className="flex gap-1 rounded-full border border-border bg-surface p-1">
          {(["all", "customers", "targets"] as Layer[]).map((l) => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={cn(
                "rounded-full px-3 py-1 text-[11.5px] font-medium capitalize transition",
                layer === l
                  ? "bg-bg-alt text-ink"
                  : "text-ink-muted hover:text-ink"
              )}
            >
              {l === "all" ? "All pins" : l}
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-4 overflow-hidden rounded-card border border-border bg-surface">
        <ComposableMap
          projectionConfig={{ scale: projection.scale, center: projection.center }}
          width={980}
          height={520}
          style={{ width: "100%", height: "auto" }}
        >
          <Geographies geography={geoUrl}>
            {({ geographies }) =>
              geographies.map((geo) => (
                <Geography
                  key={geo.rsmKey}
                  geography={geo}
                  style={{
                    default: { fill: "#EEEBE2", stroke: "#D8D3C3", strokeWidth: 0.5, outline: "none" },
                    hover: { fill: "#E4EDDB", stroke: "#C9C3B4", outline: "none" },
                    pressed: { fill: "#E4EDDB", outline: "none" },
                  }}
                />
              ))
            }
          </Geographies>

          {visibleCustomers.map((c) => (
            <Marker
              key={c.id}
              coordinates={[c.lon, c.lat]}
              onMouseEnter={() => setHover({ kind: "customer", c })}
              onMouseLeave={() => setHover(null)}
            >
              <circle
                r={c.vendor === "legora" ? 5 : 4}
                fill={c.vendor === "legora" ? "#1F3D2E" : "#A8453F"}
                stroke="#FFFFFF"
                strokeWidth={1.5}
                style={{ cursor: "pointer" }}
              />
            </Marker>
          ))}

          {visibleTargets.map((t) => (
            <Marker
              key={t.id}
              coordinates={[t.lon, t.lat]}
              onMouseEnter={() => setHover({ kind: "target", t })}
              onMouseLeave={() => setHover(null)}
            >
              <circle
                r={3.5}
                fill="transparent"
                stroke="#1F3D2E"
                strokeWidth={1.5}
                strokeDasharray="2 2"
                style={{ cursor: "pointer" }}
              />
            </Marker>
          ))}
        </ComposableMap>

        {/* Legend */}
        <div className="absolute bottom-3 left-3 flex flex-wrap gap-3 rounded-lg bg-bg-alt/90 px-3 py-2 text-[11px] text-ink-muted">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-gold" />
            Legora
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full bg-rag-red" />
            Harvey
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-full border border-dashed border-gold" />
            Targets (illustrative)
          </span>
        </div>

        {/* Hover card */}
        {hover && (
          <div className="pointer-events-none absolute right-3 top-3 max-w-xs rounded-lg border border-border bg-bg-alt/95 p-3 shadow-soft">
            {hover.kind === "customer" ? (
              <>
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{
                      background:
                        hover.c.vendor === "legora" ? "#1F3D2E" : "#A8453F",
                    }}
                  />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-ink-muted">
                    {hover.c.vendor}
                  </span>
                  {hover.c.firmTier && (
                    <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 font-mono text-[9px] text-ink-muted">
                      {hover.c.firmTier}
                    </span>
                  )}
                </div>
                <div className="mt-1 text-[14px] font-medium text-ink">
                  {hover.c.firm}
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-muted">
                  {hover.c.country}
                  {hover.c.stage && ` · ${hover.c.stage}`}
                </div>
                {hover.c.note && (
                  <div className="mt-2 text-[11.5px] text-ink-muted">
                    {hover.c.note}
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <span className="size-2 rounded-full border border-dashed border-gold" />
                  <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-gold">
                    Target · illustrative
                  </span>
                  <span className="ml-auto rounded-full border border-border px-1.5 py-0.5 font-mono text-[9px] text-ink-muted">
                    {hover.t.tier}
                  </span>
                </div>
                <div className="mt-1 text-[14px] font-medium text-ink">
                  {hover.t.firm}
                </div>
                <div className="mt-0.5 text-[11.5px] text-ink-muted">
                  {hover.t.country} · {hover.t.stage}
                </div>
                <div className="mt-2 text-[11.5px] text-ink-muted">
                  {hover.t.whyThem}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-[12px] text-ink-muted">
        <span>
          <span className="font-mono text-ink">
            {customers.filter((c) => c.vendor === "legora").length}
          </span>{" "}
          Legora customers publicly named
        </span>
        <span>
          <span className="font-mono text-ink">
            {customers.filter((c) => c.vendor === "harvey").length}
          </span>{" "}
          Harvey customers publicly named
        </span>
        <span>
          <span className="font-mono text-ink">{targets.length}</span>{" "}
          illustrative targets
        </span>
      </div>
    </section>
  );
}
