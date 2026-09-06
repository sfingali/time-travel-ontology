#!/usr/bin/env node
/** Archive importer -> instances/generated (never overwrites instances/*.json) */
import { mkdir, readdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { constants as fsConstants } from "node:fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SECTIONS = ["films", "tv", "novels"];
const RULE_HINTS = [
  [/entropy|inversion|tenet|turnstile/i, "entropy_inversion", 5],
  [/return_by_death|death_loop|death_checkpoint|blood_reset/i, "death_checkpoint_rewrite", 5],
  [/tva|sacred.?timeline|prune|variant/i, "branch_bureaucracy_prune", 5],
  [/worldline|attractor|reading.?steiner|divergence/i, "worldline_attractor", 5],
  [/tangent|donnie.?darko/i, "tangent_universe", 5],
  [/groundhog|day_loop|temporal_loop|loop_exit|ymbryne/i, "temporal_loop_exit", 4],
  [/predestination|closed_loop|destiny_manipulation|bootstrap_predestination/i, "predestination_closed_loop", 4],
  [/bootstrap|ontological|inspiration_bootstrap/i, "bootstrap_ontological", 3],
  [/multiverse|parallel_world|verse.?jump|correspondence|counterpart/i, "multiverse_contact", 4],
  [/branch(ing)?|fork|alternate_history|butterfly/i, "branch_on_intervention", 3],
  [/mutable|ripple|overwrite|reality_rewrite|set_right|personal_rewrite/i, "mutable_ripple", 3],
  [/novikov|immutable|fixed.?timeline|grandfather/i, "fixed_novikov", 3],
  [/perception|non.?linear.?conscious|precog|prophetic|unstuck/i, "perception_nonlinear", 3],
  [/time_machine|delorean|time_slip|timeslip|portal|wormhole|displacement/i, "mutable_ripple", 1],
];
const TOPOLOGY_FOR_PRIMARY = {
  entropy_inversion: "inverted_single_timeline",
  fixed_novikov: "single_fixed_timeline",
  predestination_closed_loop: "single_fixed_timeline",
  temporal_loop_exit: "single_fixed_timeline",
  death_checkpoint_rewrite: "single_fixed_timeline",
  perception_nonlinear: "single_fixed_timeline",
  bootstrap_ontological: "single_fixed_timeline",
  mutable_ripple: "mutable_single_with_ripples",
  branch_on_intervention: "branching_tree",
  branch_bureaucracy_prune: "branching_tree",
  worldline_attractor: "worldline_bundle",
  tangent_universe: "tangent_bubble",
  multiverse_contact: "dual_parallel_pair",
};
function parseArgs(argv) {
  let archiveRoot = path.resolve(root, "..", "time-travel-archive");
  for (let i = 0; i < argv.length; i++) {
    if (argv[i] === "--archive" && argv[i + 1]) archiveRoot = path.resolve(argv[++i]);
  }
  return { archiveRoot };
}
function splitTags(raw) {
  if (raw == null) return [];
  return String(raw).split("|").map((t) => t.trim()).filter(Boolean);
}
function parseFrontmatter(md) {
  if (!md.startsWith("---")) return { fm: {}, body: md };
  const end = md.indexOf("\n---", 3);
  if (end < 0) return { fm: {}, body: md };
  const block = md.slice(3, end).replace(/^\n/, "");
  const body = md.slice(end + 4).replace(/^\n/, "");
  const fm = {};
  for (const line of block.split("\n")) {
    if (!line.trim() || line.trimStart().startsWith("#")) continue;
    if (/^\s+-/.test(line)) continue;
    const m = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!m) continue;
    const key = m[1];
    let val = m[2].trim();
    if (val === "" || val === "|" || val === ">") continue;
    if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) val = val.slice(1, -1);
    if (key === "year" && /^-?\d+$/.test(val)) fm.year = Number(val);
    else if (val === "true" || val === "false") fm[key] = val === "true";
    else if (val === "[]") fm[key] = [];
    else fm[key] = val;
  }
  return { fm, body };
}
function mapRules(mechanismTags, paradoxTags) {
  const scores = new Map();
  const bump = (rule, w) => scores.set(rule, (scores.get(rule) ?? 0) + w);
  for (const tag of [...mechanismTags, ...paradoxTags]) {
    for (const [re, rule, weight] of RULE_HINTS) if (re.test(tag)) bump(rule, weight);
  }
  if (scores.size === 0) bump("mutable_ripple", 1);
  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1]);
  const primary = ranked[0][0];
  const mixins = ranked.slice(1).filter(([, w]) => w >= 2).map(([r]) => r).filter((r) => r !== primary).slice(0, 3);
  return { primary, mixins, all: [primary, ...mixins] };
}
function mapTopology(primary, paradoxTags, mechanismTags) {
  const tags = [...paradoxTags, ...mechanismTags].join(" ");
  if (/origin.?world|twin|dark.?like|knot/i.test(tags)) return "origin_plus_twins";
  if (/tangent/i.test(tags)) return "tangent_bubble";
  if (/worldline|attractor/i.test(tags)) return "worldline_bundle";
  if (/parallel|multiverse|mirror/i.test(tags)) return "dual_parallel_pair";
  if (/branch|fork|alternate/i.test(tags)) return "branching_tree";
  if (/ripple|overwrite|butterfly/i.test(tags)) return "mutable_single_with_ripples";
  if (/entrop|invers/i.test(tags)) return "inverted_single_timeline";
  return TOPOLOGY_FOR_PRIMARY[primary] ?? "single_fixed_timeline";
}
function mediumFrom(section, fm) {
  const m = String(fm.medium ?? section).toLowerCase();
  if (m.includes("film")) return "film";
  if (m === "tv" || m.includes("television") || m.includes("series")) return "tv";
  if (m.includes("novel")) return "novel";
  if (m.includes("short")) return "short_story";
  if (section === "films") return "film";
  if (section === "tv") return "tv";
  if (section === "novels") return "novel";
  return "other";
}
function blurbFromBody(body) {
  const m = body.match(/## Short blurb\s*\n+([\s\S]*?)(?=\n## |\n# |$)/i);
  if (!m) return "Draft stub imported from archive frontmatter; deepen by hand.";
  return m[1].replace(/\n+/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
}
function buildStub(meta, blurb) {
  const worldId = "w_" + meta.id.replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
  const metaObj = { id: meta.id, title: meta.title, medium: meta.medium, sources: [meta.archivePath, "generated by import"] };
  if (meta.year != null) metaObj.year = meta.year;
  return {
    meta: metaObj,
    ruleSetIds: meta.ruleSetIds,
    primaryRuleSetId: meta.primaryRuleSetId,
    mixinRuleSetIds: meta.mixinRuleSetIds,
    topologyPatternId: meta.topologyPatternId,
    worlds: [{ kind: "timeline", id: worldId, label: meta.title + " (draft world)", description: "Auto-stub; topology=" + meta.topologyPatternId }],
    agents: [{ id: "protagonist", label: "Protagonist (stub)", continuityRole: "primary", homeWorldRef: worldId }],
    events: [{ id: "e_stub_anchor", type: "ordinary", label: blurb.slice(0, 120) || "Archive anchor event (stub)", at: { worldRef: worldId, timeLabel: "unspecified" }, agents: ["protagonist"], payload: { note: "Draft only", tags: [...meta.mechanismTags, ...meta.paradoxTags].slice(0, 12) } }],
    edges: [],
    interventions: [],
    outcome: { summary: "DRAFT (" + meta.confidence + "): " + blurb, endWorldRefs: [worldId] },
  };
}
async function exists(p) {
  try { await access(p, fsConstants.F_OK); return true; } catch { return false; }
}
async function main() {
  const { archiveRoot } = parseArgs(process.argv.slice(2));
  if (!(await exists(archiveRoot))) { console.error("Archive not found: " + archiveRoot); process.exit(1); }
  const outDir = path.join(root, "instances", "generated");
  await mkdir(outDir, { recursive: true });
  const handCrafted = new Set((await readdir(path.join(root, "instances"))).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, "")));
  const index = [];
  let written = 0, skippedHand = 0;
  for (const section of SECTIONS) {
    const dir = path.join(archiveRoot, section);
    if (!(await exists(dir))) continue;
    const files = (await readdir(dir)).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort();
    for (const file of files) {
      const baseSlug = file.replace(/\.md$/, "");
      if (handCrafted.has(baseSlug)) { skippedHand += 1; continue; }
      const archivePath = "time-travel-archive/" + section + "/" + file;
      const raw = await readFile(path.join(dir, file), "utf8");
      const { fm, body } = parseFrontmatter(raw);
      const mechanismTags = splitTags(fm.mechanism);
      const paradoxTags = splitTags(fm.paradox_type);
      const mapped = mapRules(mechanismTags, paradoxTags);
      const topologyPatternId = mapTopology(mapped.primary, paradoxTags, mechanismTags);
      const meta = {
        id: baseSlug, title: String(fm.title ?? baseSlug), year: fm.year,
        medium: mediumFrom(section, fm), archivePath, mechanismTags, paradoxTags,
        primaryRuleSetId: mapped.primary, mixinRuleSetIds: mapped.mixins, ruleSetIds: mapped.all,
        topologyPatternId, confidence: mechanismTags.length + paradoxTags.length >= 2 ? "medium" : "low",
      };
      await writeFile(path.join(outDir, meta.id + ".json"), JSON.stringify(buildStub(meta, blurbFromBody(body)), null, 2) + "\n", "utf8");
      written += 1;
      index.push(meta);
    }
  }
  await writeFile(path.join(outDir, "_index.json"), JSON.stringify({
    generatedAt: new Date().toISOString(), archiveRoot,
    counts: { written, skippedHandCrafted: skippedHand, totalIndexed: index.length },
    stubs: index.map((s) => ({ id: s.id, title: s.title, year: s.year, medium: s.medium, primaryRuleSetId: s.primaryRuleSetId, mixinRuleSetIds: s.mixinRuleSetIds, topologyPatternId: s.topologyPatternId, archivePath: s.archivePath, confidence: s.confidence })),
  }, null, 2) + "\n", "utf8");
  console.log("Import complete: wrote " + written + " stubs; skipped " + skippedHand + " hand-crafted; index written.");
}
main().catch((err) => { console.error(err); process.exit(1); });
