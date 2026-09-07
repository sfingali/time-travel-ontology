#!/usr/bin/env node
/**
 * Archive importer → instances/generated/ only.
 *
 * Skip / overwrite policy
 * -----------------------
 * - NEVER writes or updates instances/*.json (hand-crafted encodings).
 * - ONLY writes under instances/generated/.
 * - If a hand-crafted instances/<slug>.json exists, that archive entry is skipped
 *   (no generated stub for the same slug).
 * - If instances/generated/<slug>.json already exists, it is left alone unless
 *   --force-generated is passed (refresh stubs).
 * - Always regenerates instances/generated/_index.json and the quality report.
 *
 * Output planning (planOutputs)
 * -----------------------------
 * - Archive slugs are only unique per section, so a slug used by more than one
 *   section is namespaced (films→film, tv→tv, novels→novel): `film-<slug>`,
 *   `tv-<slug>`, … Those are reported as `namespaceCollisions`.
 * - If two archive entries still want the same output file (e.g. a literal
 *   `film-foo` slug meeting a namespaced `film-foo`), BOTH are blocked rather
 *   than silently overwriting one another, and reported as `outputCollisions`.
 * - Generated files on disk are inventoried as retained / superseded (now owned
 *   by a hand-crafted instance or by a namespaced id) / orphaned (nothing in the
 *   archive maps to them any more). Nothing is deleted; the report names them.
 *
 * Self-validation
 * ---------------
 * Every stub is validated with dist/validate.js (`validateStoryEncoding`) before
 * being written. A stub that fails is reported as a file error and NOT written,
 * so the generated corpus can never contain schema-invalid encodings. When
 * dist/validate.js is missing (no `npm run build` yet) validation is skipped
 * with a single warning.
 *
 * Exit code is 1 when there are file errors, output collisions or ambiguous
 * hand matches.
 *
 * Archive root resolution (first hit wins)
 * ----------------------------------------
 * 1. --archive <path>
 * 2. ARCHIVE_ROOT env
 * 3. ./reference-archive  (when that directory exists)
 * 4. ../time-travel-archive (legacy sibling checkout)
 *
 * Tag → catalogue mapping is documented in docs/IMPORT.md (and mirrored below).
 */
import { mkdir, readdir, readFile, writeFile, access } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { constants as fsConstants } from "node:fs";
import { parse as parseYaml } from "yaml";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");
const SECTIONS = ["films", "tv", "novels"];
/** Section → id prefix used when the same slug appears in more than one section. */
const SECTION_ID_PREFIX = { films: "film", tv: "tv", novels: "novel" };

/**
 * Exact (case-insensitive) archive tag → ruleSetId weights.
 * Prefer these over regex so common YAML tokens land on the right catalogue id.
 *
 * mechanism / paradox_type → primary candidates (higher weight = more decisive)
 */
const EXACT_TAG_RULES = {
  // Entropy / Tenet
  entropy_inversion: ["entropy_inversion", 6],
  inversion: ["entropy_inversion", 5],
  turnstile: ["entropy_inversion", 5],
  inverted_entropy: ["entropy_inversion", 6],
  // Death checkpoint / Re:Zero
  return_by_death: ["death_checkpoint_rewrite", 6],
  death_loop: ["death_checkpoint_rewrite", 5],
  death_checkpoint: ["death_checkpoint_rewrite", 6],
  blood_reset: ["death_checkpoint_rewrite", 5],
  revival_leap: ["death_checkpoint_rewrite", 3],
  // TVA / Loki bureaucracy
  tva: ["branch_bureaucracy_prune", 6],
  sacred_timeline: ["branch_bureaucracy_prune", 6],
  prune: ["branch_bureaucracy_prune", 5],
  variant: ["branch_bureaucracy_prune", 3],
  nexus_event: ["branch_bureaucracy_prune", 4],
  // Worldlines / Steins;Gate
  worldlines: ["worldline_attractor", 6],
  worldline: ["worldline_attractor", 6],
  attractor: ["worldline_attractor", 5],
  attractor_field: ["worldline_attractor", 6],
  reading_steiner: ["worldline_attractor", 6],
  divergence: ["worldline_attractor", 4],
  divergence_meter: ["worldline_attractor", 5],
  time_leap_machine: ["worldline_attractor", 3],
  // Tangent / Donnie Darko
  tangent: ["tangent_universe", 5],
  tangent_universe: ["tangent_universe", 6],
  living_receiver: ["tangent_universe", 5],
  // Loops with exit
  groundhog_day_loop: ["temporal_loop_exit", 6],
  groundhog: ["temporal_loop_exit", 5],
  day_loop: ["temporal_loop_exit", 5],
  temporal_loop: ["temporal_loop_exit", 4],
  loop_exit: ["temporal_loop_exit", 5],
  ymbryne: ["temporal_loop_exit", 4],
  time_loop: ["temporal_loop_exit", 4],
  loop: ["temporal_loop_exit", 3],
  nested_loops: ["temporal_loop_exit", 4],
  character_growth_exit: ["temporal_loop_exit", 4],
  year_reset_experiment: ["temporal_loop_exit", 4],
  shared_cohort_loop: ["temporal_loop_exit", 4],
  groundhog_year: ["temporal_loop_exit", 5],
  // Predestination / closed loop
  predestination: ["predestination_closed_loop", 5],
  closed_loop: ["predestination_closed_loop", 4],
  closed_loop_elements: ["predestination_closed_loop", 3],
  closed_loop_romance: ["predestination_closed_loop", 3],
  closed_loop_mission: ["predestination_closed_loop", 4],
  closed_loop_comedy: ["predestination_closed_loop", 3],
  closed_loop_attempt: ["predestination_closed_loop", 3],
  closed_loop_temptation: ["predestination_closed_loop", 3],
  closed_loop_resistance: ["predestination_closed_loop", 3],
  destiny_manipulation: ["predestination_closed_loop", 4],
  bootstrap_predestination: ["predestination_closed_loop", 5],
  emotional_closed_loop: ["predestination_closed_loop", 3],
  // Bootstrap
  bootstrap: ["bootstrap_ontological", 5],
  ontological: ["bootstrap_ontological", 4],
  inspiration_bootstrap: ["bootstrap_ontological", 5],
  bootstrap_romance: ["bootstrap_ontological", 4],
  bootstrap_upgrade: ["bootstrap_ontological", 3],
  letters_from_future_selves: ["bootstrap_ontological", 4],
  information_transfer: ["bootstrap_ontological", 3],
  // Multiverse / parallel
  multiverse_contact: ["multiverse_contact", 6],
  multiverse: ["multiverse_contact", 5],
  parallel_worlds: ["multiverse_contact", 5],
  parallel_world: ["multiverse_contact", 5],
  parallel_universe_rescue: ["multiverse_contact", 4],
  verse_jump: ["multiverse_contact", 5],
  correspondence: ["multiverse_contact", 4],
  counterpart: ["multiverse_contact", 5],
  reality_bleed: ["multiverse_contact", 4],
  parallel_eras: ["multiverse_contact", 3],
  pandominion_step: ["multiverse_contact", 4],
  subtle_knife_windows: ["multiverse_contact", 4],
  traverser_tech: ["multiverse_contact", 4],
  world_between_worlds: ["multiverse_contact", 4],
  // Branching
  branching_timeline: ["branch_on_intervention", 5],
  branching: ["branch_on_intervention", 4],
  branching_attempt: ["branch_on_intervention", 4],
  branching_rescue: ["branch_on_intervention", 4],
  branching_risk: ["branch_on_intervention", 3],
  branching_lives: ["branch_on_intervention", 4],
  fork: ["branch_on_intervention", 3],
  alternate_history: ["branch_on_intervention", 5],
  alternate_present: ["branch_on_intervention", 4],
  butterfly_effect: ["branch_on_intervention", 4],
  butterfly_catastrophe: ["branch_on_intervention", 4],
  flashpoint: ["branch_on_intervention", 4],
  changewar: ["branch_on_intervention", 4],
  time_war: ["branch_on_intervention", 3],
  history_resists_branch: ["branch_on_intervention", 3],
  timeline_restoration: ["branch_on_intervention", 3],
  // Mutable / ripple
  mutable: ["mutable_ripple", 3],
  ripple: ["mutable_ripple", 4],
  overwrite: ["mutable_ripple", 4],
  reality_rewrite: ["mutable_ripple", 5],
  set_right_what_once_went_wrong: ["mutable_ripple", 5],
  set_right: ["mutable_ripple", 4],
  personal_rewrite: ["mutable_ripple", 5],
  serial_killer_ripple: ["mutable_ripple", 3],
  multi_reset_memory: ["mutable_ripple", 3],
  reset_choice: ["mutable_ripple", 3],
  // Fixed / Novikov
  novikov: ["fixed_novikov", 5],
  immutable: ["fixed_novikov", 4],
  immutable_present: ["fixed_novikov", 5],
  fixed_timeline: ["fixed_novikov", 5],
  grandfather: ["fixed_novikov", 3],
  grandfather_risk: ["fixed_novikov", 4],
  block_universe: ["fixed_novikov", 4],
  past_resistance: ["fixed_novikov", 3],
  // Perception-only
  perception: ["perception_nonlinear", 3],
  non_linear_consciousness: ["perception_nonlinear", 6],
  nonlinear_consciousness: ["perception_nonlinear", 6],
  precog: ["perception_nonlinear", 4],
  prophetic: ["perception_nonlinear", 3],
  prophetic_tv_serial: ["perception_nonlinear", 4],
  unstuck: ["perception_nonlinear", 4],
  unstuck_in_time: ["perception_nonlinear", 5],
  memory_as_time_travel: ["perception_nonlinear", 5],
  dual_consciousness: ["perception_nonlinear", 3],
  // Soft / device defaults (low weight → mixin or weak primary)
  time_machine: ["mutable_ripple", 1],
  delorean: ["mutable_ripple", 2],
  time_slip: ["mutable_ripple", 2],
  timeslip: ["mutable_ripple", 2],
  unexplained_timeslip: ["mutable_ripple", 2],
  time_displacement: ["mutable_ripple", 2],
  portal: ["mutable_ripple", 1],
  wormhole: ["mutable_ripple", 1],
  displacement: ["mutable_ripple", 1],
  machine: ["mutable_ripple", 1],
  time_gate: ["mutable_ripple", 1],
  timedoor: ["mutable_ripple", 1],
  standing_stones: ["mutable_ripple", 2],
  oxford_net: ["branch_on_intervention", 2],
  speed_force: ["mutable_ripple", 2],
  body_swap: ["mutable_ripple", 2],
  cassette_walkman_body_swap: ["mutable_ripple", 2],
  hot_tub_portal: ["mutable_ripple", 1],
  house_portal: ["mutable_ripple", 1],
  diner_portal: ["mutable_ripple", 1],
  fixed_portal_diner: ["mutable_ripple", 1],
  mysterious_mailbox: ["mutable_ripple", 2],
  overlapping_selves: ["bootstrap_ontological", 3],
  relativistic_time_dilation: ["perception_nonlinear", 2],
  hibernation_oversleep: ["perception_nonlinear", 1],
  one_way_future: ["fixed_novikov", 2],
  historical_tourism: ["mutable_ripple", 1],
  historical_displacement: ["mutable_ripple", 1],
  historical_intervention: ["mutable_ripple", 2],
  fish_out_of_water: ["mutable_ripple", 1],
  fish_out_of_water_romance: ["mutable_ripple", 1],
  fish_out_of_water_comedy: ["mutable_ripple", 1],
  comedy_displacement: ["mutable_ripple", 1],
  chaotic_history_tourism: ["mutable_ripple", 1],
  time_slip_romance: ["mutable_ripple", 1],
  time_portal: ["mutable_ripple", 1],
  none_explicit: ["mutable_ripple", 0],
  ambiguous_ontology: ["bootstrap_ontological", 1],
  ambiguous_mechanism: ["mutable_ripple", 0],
};

/** Regex fallbacks when exact map misses (tag substring / compound tokens). */
const RULE_HINTS = [
  [/entropy|inversion|tenet|turnstile/i, "entropy_inversion", 5],
  [/return_by_death|death_loop|death_checkpoint|blood_reset/i, "death_checkpoint_rewrite", 5],
  [/tva|sacred.?timeline|prune|nexus.?event/i, "branch_bureaucracy_prune", 5],
  [/worldline|attractor|reading.?steiner|divergence/i, "worldline_attractor", 5],
  [/tangent|donnie.?darko|living.?receiver/i, "tangent_universe", 5],
  [/groundhog|day_loop|temporal_loop|loop_exit|ymbryne|time_loop|year_reset/i, "temporal_loop_exit", 4],
  [/\bloop\b/i, "temporal_loop_exit", 2],
  [/predestination|closed_loop|destiny_manipulation|bootstrap_predestination/i, "predestination_closed_loop", 4],
  [/bootstrap|ontological|inspiration_bootstrap|overlapping_selves/i, "bootstrap_ontological", 3],
  [/multiverse|parallel_world|verse.?jump|correspondence|counterpart|reality_bleed|pandominion|subtle_knife|traverser/i, "multiverse_contact", 4],
  [/branch(ing)?|fork|alternate_history|alternate_present|butterfly|flashpoint|changewar|time_war/i, "branch_on_intervention", 3],
  [/mutable|ripple|overwrite|reality_rewrite|set_right|personal_rewrite/i, "mutable_ripple", 3],
  [/novikov|immutable|fixed.?timeline|grandfather|block_universe|past_resistance/i, "fixed_novikov", 3],
  [/perception|non.?linear.?conscious|precog|prophetic|unstuck|memory_as_time/i, "perception_nonlinear", 3],
  [/time_machine|delorean|time_slip|timeslip|portal|wormhole|displacement|standing_stones|oxford_net|speed_force|body_swap/i, "mutable_ripple", 1],
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
  let archiveRoot = null;
  let forceGenerated = false;
  let reportFormat = "both"; // markdown | json | both
  for (let i = 0; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--archive" || a === "--report") {
      const value = argv[i + 1];
      if (!value || value.startsWith("-")) {
        throw new Error(`${a} requires a value`);
      }
      i += 1;
      if (a === "--archive") {
        archiveRoot = path.resolve(value);
      } else {
        reportFormat = value.toLowerCase();
        if (!["md", "markdown", "json", "both"].includes(reportFormat)) {
          throw new Error(`Invalid --report value "${value}"; expected md|markdown|json|both`);
        }
      }
    } else if (a === "--force-generated") forceGenerated = true;
    else if (a === "--help" || a === "-h") {
      console.log(`Usage: node scripts/import-archive.mjs [--archive PATH] [--force-generated] [--report md|json|both]
  ARCHIVE_ROOT env overrides default when --archive is omitted.
  Default archive: ./reference-archive if present, else ../time-travel-archive.`);
      process.exit(0);
    } else {
      throw new Error(`Unknown argument: ${a}`);
    }
  }
  return { archiveRoot, forceGenerated, reportFormat };
}

async function resolveArchiveRoot(cliRoot) {
  if (cliRoot) return cliRoot;
  if (process.env.ARCHIVE_ROOT) return path.resolve(process.env.ARCHIVE_ROOT);
  const vendored = path.join(root, "reference-archive");
  if (await exists(vendored)) return vendored;
  return path.resolve(root, "..", "time-travel-archive");
}

function splitTags(raw) {
  if (raw == null) return [];
  if (Array.isArray(raw)) return raw.map((t) => String(t).trim()).filter(Boolean);
  return String(raw)
    .split("|")
    .map((t) => t.trim())
    .filter(Boolean);
}

/**
 * `---` … `---` frontmatter block, tolerating CRLF and trailing spaces on the
 * fences, and an empty block (`---\n---`). Anchored at the start of the file so
 * a `---` rule inside the markdown body can never be mistaken for a fence.
 */
const FRONTMATTER_RE = /^---[ \t]*\r?\n([\s\S]*?)(?:\r?\n)?---[ \t]*(?:\r?\n|$)/;

/**
 * Parse archive frontmatter with a real YAML parser (block lists, quoted and
 * multi-line scalars, inline comments, typed scalars). A leading BOM is
 * stripped first, since it would otherwise hide the opening fence.
 *
 * `mechanism` / `paradox_type` stay pipe-delimited plain scalars in the archive
 * ("a | b" is a string in YAML, not a list) — splitTags() still splits them.
 *
 * @returns {{ fm: Record<string, unknown>, body: string }} `fm` is `{}` when the
 *   file has no frontmatter block. Throws on malformed YAML; callers record
 *   that as a per-file error.
 */
function parseFrontmatter(md) {
  const text = md.charCodeAt(0) === 0xfeff ? md.slice(1) : md;
  const match = FRONTMATTER_RE.exec(text);
  if (!match) return { fm: {}, body: text };
  const parsed = parseYaml(match[1]);
  const fm =
    parsed !== null && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : {};
  return { fm, body: text.slice(match[0].length).replace(/^\r?\n/, "") };
}

function mapRules(mechanismTags, paradoxTags) {
  const scores = new Map();
  const matchedTags = new Map(); // rule -> tags
  const unmapped = [];
  const bump = (rule, w, tag) => {
    if (!rule || w <= 0) return;
    scores.set(rule, (scores.get(rule) ?? 0) + w);
    if (!matchedTags.has(rule)) matchedTags.set(rule, []);
    matchedTags.get(rule).push(tag);
  };

  for (const tag of [...mechanismTags, ...paradoxTags]) {
    const key = tag.toLowerCase().replace(/\s+/g, "_");
    let hit = false;
    const exact = EXACT_TAG_RULES[key] ?? EXACT_TAG_RULES[tag.toLowerCase()];
    if (exact) {
      bump(exact[0], exact[1], tag);
      hit = true;
    } else {
      for (const [re, rule, weight] of RULE_HINTS) {
        if (re.test(tag)) {
          bump(rule, weight, tag);
          hit = true;
          break; // first regex match only per tag
        }
      }
    }
    if (!hit) unmapped.push(tag);
  }

  if (scores.size === 0) bump("mutable_ripple", 1, "(default)");

  const ranked = [...scores.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const primary = ranked[0][0];
  const topScore = ranked[0][1];
  const mixins = ranked
    .slice(1)
    .filter(([, w]) => w >= 2)
    .map(([r]) => r)
    .filter((r) => r !== primary)
    .slice(0, 3);

  // Confidence: high = strong exact-ish primary + enough tags; medium = scored; low = default/weak
  let confidence = "low";
  const tagCount = mechanismTags.length + paradoxTags.length;
  if (topScore >= 5 && tagCount >= 2 && unmapped.length === 0) confidence = "high";
  else if (topScore >= 3 && tagCount >= 1) confidence = "medium";
  else if (topScore >= 2) confidence = "medium";
  else confidence = "low";

  return {
    primary,
    mixins,
    all: [primary, ...mixins],
    scores: Object.fromEntries(ranked),
    matchedTags: Object.fromEntries([...matchedTags.entries()].map(([k, v]) => [k, [...new Set(v)]])),
    unmapped: [...new Set(unmapped)],
    confidence,
    topScore,
  };
}

function mapTopology(primary, paradoxTags, mechanismTags) {
  const tags = [...paradoxTags, ...mechanismTags].join(" ");
  if (/origin.?world|twin|dark.?like|knot/i.test(tags)) return "origin_plus_twins";
  if (/tangent|living.?receiver/i.test(tags)) return "tangent_bubble";
  if (/worldline|attractor|reading.?steiner/i.test(tags)) return "worldline_bundle";
  if (/parallel|multiverse|mirror|counterpart|verse.?jump|reality_bleed/i.test(tags)) return "dual_parallel_pair";
  if (/branch|fork|alternate|butterfly|flashpoint|changewar/i.test(tags)) return "branching_tree";
  if (/ripple|overwrite|reality_rewrite|set_right|personal_rewrite/i.test(tags)) return "mutable_single_with_ripples";
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

// Archive frontmatter carries year ranges ("2022-2024", "2024-") that YAML parses
// as strings, but meta.year is a schema-typed integer. Keep the leading year.
function coerceYear(v) {
  if (typeof v === "number") return Number.isFinite(v) ? Math.trunc(v) : null;
  if (typeof v !== "string") return null;
  const m = v.trim().match(/^(\d{4})/);
  return m ? Number(m[1]) : null;
}

function blurbFromBody(body) {
  const m = body.match(/## Short blurb\s*\n+([\s\S]*?)(?=\n## |\n# |$)/i);
  if (!m) return "Draft stub imported from archive frontmatter; deepen by hand.";
  return m[1].replace(/\n+/g, " ").replace(/\s+/g, " ").trim().slice(0, 280);
}

function buildStub(meta, blurb) {
  const worldId = "w_" + meta.id.replace(/[^a-z0-9]+/gi, "_").slice(0, 40);
  const metaObj = {
    id: meta.id,
    title: meta.title,
    medium: meta.medium,
    sources: [meta.archivePath, "generated by import"],
  };
  const year = coerceYear(meta.year);
  if (year != null) metaObj.year = year;
  return {
    meta: metaObj,
    ruleSetIds: meta.ruleSetIds,
    primaryRuleSetId: meta.primaryRuleSetId,
    mixinRuleSetIds: meta.mixinRuleSetIds,
    topologyPatternId: meta.topologyPatternId,
    worlds: [
      {
        kind: "timeline",
        id: worldId,
        label: meta.title + " (draft world)",
        description: "Auto-stub; topology=" + meta.topologyPatternId,
      },
    ],
    agents: [
      {
        id: "protagonist",
        label: "Protagonist (stub)",
        continuityRole: "primary",
        homeWorldRef: worldId,
      },
    ],
    events: [
      {
        id: "e_stub_anchor",
        type: "ordinary",
        label: blurb.slice(0, 120) || "Archive anchor event (stub)",
        at: { worldRef: worldId, timeLabel: "unspecified" },
        agents: ["protagonist"],
        payload: {
          note: "Draft only",
          tags: [...meta.mechanismTags, ...meta.paradoxTags].slice(0, 12),
        },
      },
    ],
    edges: [],
    interventions: [],
    outcome: {
      summary: "DRAFT (" + meta.confidence + "): " + blurb,
      endWorldRefs: [worldId],
    },
  };
}

async function exists(p) {
  try {
    await access(p, fsConstants.F_OK);
    return true;
  } catch (error) {
    if (error?.code === "ENOENT") return false;
    throw error;
  }
}

function hasDiagramSignal(fm) {
  if (fm.flag_diagrams === true) return true;
  if (Array.isArray(fm.diagram_refs) && fm.diagram_refs.length > 0) return true;
  if (typeof fm.diagram_refs === "string" && fm.diagram_refs.trim() && fm.diagram_refs.trim() !== "[]") return true;
  return false;
}

function normalizeTitle(t) {
  return String(t || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "");
}

function creatorKeyFromMeta(meta) {
  const value = meta.creator ?? meta.creators ?? meta.author ?? meta.director;
  if (value == null) return null;
  const values = Array.isArray(value) ? value : [value];
  const keys = values.map(normalizeTitle).filter(Boolean);
  return keys.length ? [...new Set(keys)].sort().join("|") : null;
}

function sameOptionalValue(left, right) {
  if (left == null && right == null) return true;
  return left != null && right != null && String(left) === String(right);
}

async function loadHandCraftedMeta(instancesDir, handCraftedIds) {
  const entries = [];
  const errors = [];
  for (const id of handCraftedIds) {
    const file = path.join(instancesDir, id + ".json");
    try {
      const data = JSON.parse(await readFile(file, "utf8"));
      if (
        typeof data?.meta?.title !== "string" ||
        typeof data?.meta?.medium !== "string"
      ) {
        throw new Error("Hand encoding lacks title/medium metadata");
      }
      entries.push({ id, meta: data.meta });
    } catch (error) {
      errors.push({ file, error: String(error) });
    }
  }
  return { entries, errors };
}

function findHandMatch(baseSlug, title, medium, fm, handEntries) {
  // Slug identity is authoritative.
  if (handEntries.some((e) => e.id === baseSlug)) return baseSlug;
  const nt = normalizeTitle(title);
  if (!nt) return null;
  const matches = handEntries.filter((e) => {
    if (normalizeTitle(e.meta.title) !== nt) return false;
    if (String(e.meta.medium).toLowerCase() !== String(medium).toLowerCase()) return false;
    if (!sameOptionalValue(e.meta.year, fm.year)) return false;
    const c1 = creatorKeyFromMeta(e.meta);
    const c2 = creatorKeyFromMeta(fm);
    if (c1 != null || c2 != null) {
      if (c1 !== c2) return false;
    }
    return true;
  });
  if (matches.length > 1) {
    return { status: "AMBIGUOUS", candidates: matches.map((e) => e.id).sort() };
  }
  return matches.length === 1 ? matches[0].id : null;
}

function storedStubMetadata(data, file) {
  if (
    typeof data?.meta?.id !== "string" ||
    typeof data.meta.title !== "string" ||
    typeof data.meta.medium !== "string"
  ) {
    throw new Error("Generated stub lacks id/title/medium metadata");
  }
  const sources = Array.isArray(data.meta.sources)
    ? data.meta.sources.filter((s) => typeof s === "string")
    : [];
  const summary = String(data.outcome?.summary ?? "");
  const confidenceMatch = summary.match(/^DRAFT \((high|medium|low)\):/);
  const confidence = confidenceMatch ? confidenceMatch[1] : null;
  const tags = Array.isArray(data.events)
    ? data.events.flatMap((e) =>
        Array.isArray(e.payload?.tags) ? e.payload.tags.filter((t) => typeof t === "string") : [],
      )
    : [];
  return {
    file,
    id: data.meta.id,
    title: data.meta.title,
    year: data.meta.year ?? null,
    medium: data.meta.medium,
    sources,
    archivePath: sources.find((s) => s !== "generated by import") ?? null,
    ruleSetIds: data.ruleSetIds ?? [],
    primaryRuleSetId: data.primaryRuleSetId ?? null,
    mixinRuleSetIds: data.mixinRuleSetIds ?? null,
    topologyPatternId: data.topologyPatternId ?? null,
    confidence,
    tags: [...new Set(tags)],
    writtenThisRun: false,
  };
}

/**
 * Assign one output id per scanned entry and flag the two ways ids can clash.
 *
 * 1. Archive slugs are unique per section only. A slug used by more than one
 *    section is namespaced with the section prefix (`film-`, `tv-`, `novel-`)
 *    so films/outlander.md and tv/outlander.md stop overwriting each other.
 * 2. Whatever the ids end up being, two entries may still target the same file
 *    (a literal `film-foo.md` next to a namespaced `film-foo`, or slugs that
 *    differ only by case on a case-insensitive filesystem). Both entries are
 *    blocked — silently picking a winner is what this function exists to stop.
 *
 * Mutates each entry with `outputId` and `blocked`.
 *
 * @returns {{ namespaceCollisions: object[], outputCollisions: object[] }}
 */
function planOutputs(entries) {
  const groupBy = (items, key) => {
    const map = new Map();
    for (const item of items) {
      const k = key(item);
      if (!map.has(k)) map.set(k, []);
      map.get(k).push(item);
    }
    return [...map.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  };

  const namespaceCollisions = [];
  for (const [slug, group] of groupBy(entries, (e) => e.baseSlug.toLowerCase())) {
    const sections = [...new Set(group.map((e) => e.section))].sort();
    const namespaced = sections.length > 1;
    for (const e of group) {
      e.outputId = namespaced
        ? `${SECTION_ID_PREFIX[e.section] ?? e.section}-${e.baseSlug}`
        : e.baseSlug;
      e.blocked = false;
    }
    if (namespaced) {
      namespaceCollisions.push({
        slug,
        sections,
        entries: group
          .map((e) => ({ section: e.section, archivePath: e.archivePath, outputId: e.outputId }))
          .sort((a, b) => a.outputId.localeCompare(b.outputId)),
      });
    }
  }

  const outputCollisions = [];
  for (const [key, group] of groupBy(entries, (e) => e.outputId.toLowerCase())) {
    if (group.length < 2) continue;
    for (const e of group) e.blocked = true;
    outputCollisions.push({
      outputId: key,
      blocked: true,
      entries: group
        .map((e) => ({ section: e.section, archivePath: e.archivePath, outputId: e.outputId }))
        .sort((a, b) => a.archivePath.localeCompare(b.archivePath)),
    });
  }

  return { namespaceCollisions, outputCollisions };
}

/**
 * Load the compiled semantic validator so the importer can refuse to emit
 * schema-invalid stubs. Missing/unusable build → one warning, validation off
 * (importing from a fresh checkout must not be a hard failure).
 *
 * @returns {Promise<{ validateStoryEncoding: Function } | null>}
 */
async function loadValidator() {
  const validatorPath = path.join(root, "dist", "validate.js");
  if (!(await exists(validatorPath))) {
    console.warn(
      `WARN dist/validate.js not found — stub self-validation SKIPPED. Run "npm run build" first.`,
    );
    return null;
  }
  try {
    const V = await import(pathToFileURL(validatorPath).href);
    if (typeof V.validateStoryEncoding !== "function") {
      console.warn("WARN dist/validate.js exports no validateStoryEncoding — self-validation SKIPPED.");
      return null;
    }
    return V;
  } catch (error) {
    console.warn(`WARN could not load dist/validate.js (${String(error)}) — self-validation SKIPPED.`);
    return null;
  }
}

function renderMarkdownReport(report) {
  const lines = [];
  lines.push("# Import quality report");
  lines.push("");
  lines.push(`Generated: ${report.generatedAt}`);
  lines.push(`Archive root: \`${report.archiveRoot}\``);
  lines.push("");
  lines.push("## Counts");
  lines.push("");
  const c = report.counts;
  lines.push(`| Metric | Count |`);
  lines.push(`|--------|------:|`);
  lines.push(`| Archive entries scanned | ${c.scanned} |`);
  lines.push(`| Generated stubs written | ${c.written} |`);
  lines.push(`| Generated stubs skipped (exists, no --force-generated) | ${c.skippedExistingGenerated} |`);
  lines.push(`| Skipped (hand-crafted instance present) | ${c.skippedHandCrafted} |`);
  lines.push(`| Skipped (blocked output collision) | ${c.skippedOutputCollision} |`);
  lines.push(`| Skipped (stub failed self-validation) | ${c.skippedInvalidStub} |`);
  lines.push(`| Exhaustive without hand-crafted instance | ${c.exhaustiveGaps} |`);
  lines.push(`| Diagram-flagged without hand-crafted instance | ${c.diagramGaps} |`);
  lines.push(`| Unique unmapped tags | ${c.unmappedTagTypes} |`);
  lines.push(`| Generated files retained | ${c.retainedFiles} |`);
  lines.push(`| Generated files superseded | ${c.supersededFiles} |`);
  lines.push(`| Generated files orphaned | ${c.orphanedFiles} |`);
  lines.push(`| Slugs namespaced by section | ${c.namespaceCollisions} |`);
  lines.push(`| Output collisions (blocked) | ${c.outputCollisions} |`);
  lines.push(`| Ambiguous hand matches | ${c.ambiguousMatches} |`);
  lines.push(`| File errors | ${c.fileErrors} |`);
  lines.push("");
  lines.push("## Mapping confidence");
  lines.push("");
  for (const [k, v] of Object.entries(report.confidenceCounts)) {
    lines.push(`- **${k}**: ${v}`);
  }
  lines.push("");
  lines.push("## Hand-crafted gaps (exhaustive / diagram-flagged)");
  lines.push("");
  lines.push("Titles in the archive marked `summary_depth: exhaustive` and/or `flag_diagrams: true` that lack a hand-crafted `instances/*.json` (may still have a generated stub).");
  lines.push("");
  if (report.gaps.length === 0) {
    lines.push("_None._");
  } else {
    lines.push("| Slug | Title | Section | Exhaustive | Diagram | Generated stub |");
    lines.push("|------|-------|---------|:----------:|:-------:|:--------------:|");
    for (const g of report.gaps) {
      lines.push(
        `| ${g.id} | ${g.title.replace(/\|/g, "/")} | ${g.section} | ${g.exhaustive ? "yes" : ""} | ${g.diagramFlagged ? "yes" : ""} | ${g.hasGeneratedStub ? "yes" : "no"} |`,
      );
    }
  }
  lines.push("");
  lines.push("## Unmapped tags");
  lines.push("");
  lines.push("Tags that matched neither the exact map nor regex heuristics (defaulted via other tags or `mutable_ripple`).");
  lines.push("");
  if (report.unmappedTags.length === 0) {
    lines.push("_None._");
  } else {
    lines.push("| Tag | Occurrences |");
    lines.push("|-----|------------:|");
    for (const u of report.unmappedTags) {
      lines.push(`| \`${u.tag}\` | ${u.count} |`);
    }
  }
  lines.push("");
  lines.push("## Generated stubs (this run index)");
  lines.push("");
  lines.push(`Indexed ${report.stubs.length} stub record(s) (written + previously kept). See \`instances/generated/_index.json\`.`);
  lines.push("");
  lines.push("## Policy reminder");
  lines.push("");
  lines.push("- Hand-crafted `instances/*.json` are never overwritten.");
  lines.push("- Stubs only land in `instances/generated/`.");
  lines.push("- Pass `--force-generated` to refresh existing generated stubs.");
  lines.push("");
  lines.push("See [docs/IMPORT.md](../docs/IMPORT.md) for the tag → ruleSet / topology map.");
  lines.push("");
  return lines.join("\n");
}

async function main() {
  const { archiveRoot: cliRoot, forceGenerated, reportFormat } = parseArgs(process.argv.slice(2));
  const archiveRoot = await resolveArchiveRoot(cliRoot);
  if (!(await exists(archiveRoot))) {
    console.error("Archive not found: " + archiveRoot);
    console.error("Pass --archive PATH, set ARCHIVE_ROOT, or vendor ./reference-archive");
    process.exit(1);
  }

  const instancesDir = path.join(root, "instances");
  const outDir = path.join(instancesDir, "generated");
  await mkdir(outDir, { recursive: true });

  const fileErrors = [];
  const handCraftedIds = (await readdir(instancesDir))
    .filter((f) => f.endsWith(".json"))
    .map((f) => f.replace(/\.json$/, ""))
    .sort();
  const { entries: handEntries, errors: handErrors } = await loadHandCraftedMeta(
    instancesDir,
    handCraftedIds,
  );
  fileErrors.push(...handErrors);

  const existingGenerated = new Set(
    (await readdir(outDir))
      .filter((f) => f.endsWith(".json") && f !== "_index.json" && f !== "IMPORT_REPORT.json")
      .map((f) => f.replace(/\.json$/, "")),
  );
  // Read stored stub metadata so the index reflects what is actually on disk,
  // not just this run's freshly computed mapping (review finding #11).
  const storedFiles = new Map();
  for (const id of [...existingGenerated].sort()) {
    const file = path.join(outDir, id + ".json");
    try {
      const data = JSON.parse(await readFile(file, "utf8"));
      storedFiles.set(id, storedStubMetadata(data, id + ".json"));
    } catch (error) {
      fileErrors.push({ file, error: String(error) });
    }
  }

  const validator = await loadValidator();

  const index = [];
  const gaps = [];
  const ambiguousMatches = [];
  const unmappedCounter = new Map();
  const confidenceCounts = { high: 0, medium: 0, low: 0 };
  let written = 0;
  let skippedHand = 0;
  let skippedExistingGenerated = 0;
  let skippedOutputCollision = 0;
  let skippedInvalidStub = 0;
  let scanned = 0;

  // Phase 1 — scan every archive entry. Frontmatter that will not parse is a
  // per-file error, never a crash.
  const scannedEntries = [];
  for (const section of SECTIONS) {
    const dir = path.join(archiveRoot, section);
    if (!(await exists(dir))) continue;
    const files = (await readdir(dir)).filter((f) => f.endsWith(".md") && !f.startsWith("_")).sort();
    for (const file of files) {
      scanned += 1;
      const relArchive = path.relative(root, path.join(dir, file)).replace(/\\/g, "/");
      const archivePath = relArchive.startsWith("..")
        ? `time-travel-archive/${section}/${file}`
        : relArchive;
      try {
        const raw = await readFile(path.join(dir, file), "utf8");
        const { fm, body } = parseFrontmatter(raw);
        scannedEntries.push({
          section,
          file,
          archivePath,
          baseSlug: file.replace(/\.md$/, ""),
          fm,
          body,
        });
      } catch (error) {
        fileErrors.push({ file: archivePath, kind: "frontmatter", error: String(error) });
      }
    }
  }

  // Phase 2 — decide output ids (section namespacing) and block real clashes.
  const { namespaceCollisions, outputCollisions } = planOutputs(scannedEntries);
  for (const collision of namespaceCollisions) {
    console.warn(
      `WARN slug "${collision.slug}" appears in ${collision.sections.join(" + ")}; namespaced to ${collision.entries
        .map((e) => e.outputId)
        .join(", ")}`,
    );
  }
  for (const collision of outputCollisions) {
    console.error(
      `ERROR output collision on "${collision.outputId}": ${collision.entries
        .map((e) => e.archivePath)
        .join(", ")} — all blocked (no file written)`,
    );
  }

  // Which output ids the current archive still claims, and which generated
  // files the archive has moved away from (hand-crafted / namespaced elsewhere).
  const claimedOutputIds = new Set();
  const handSupersededIds = new Map(); // outputId -> hand-crafted instance id
  const namespacedAwayIds = new Map(); // old baseSlug -> [new outputIds]

  // Phase 3 — emit.
  for (const entry of scannedEntries) {
    const { section, archivePath, baseSlug, outputId, blocked, fm, body } = entry;
    const title = String(fm.title ?? baseSlug);
    const medium = mediumFrom(section, fm);
    const mechanismTags = splitTags(fm.mechanism);
    const paradoxTags = splitTags(fm.paradox_type);
    const mapped = mapRules(mechanismTags, paradoxTags);
    const topologyPatternId = mapTopology(mapped.primary, paradoxTags, mechanismTags);
    const exhaustive = String(fm.summary_depth || "").toLowerCase() === "exhaustive";
    const diagramFlagged = hasDiagramSignal(fm);
    // Hand-match identity is still keyed on the archive slug: hand-crafted ids
    // are never section-namespaced.
    const handMatch = findHandMatch(baseSlug, title, medium, fm, handEntries);
    const handCraftedId = typeof handMatch === "string" ? handMatch : null;
    const ambiguous = handMatch !== null && typeof handMatch === "object";

    for (const t of mapped.unmapped) {
      unmappedCounter.set(t, (unmappedCounter.get(t) ?? 0) + 1);
    }

    const meta = {
      id: outputId,
      baseSlug,
      title,
      year: coerceYear(fm.year),
      medium,
      archivePath,
      section,
      namespaced: outputId !== baseSlug,
      mechanismTags,
      paradoxTags,
      primaryRuleSetId: mapped.primary,
      mixinRuleSetIds: mapped.mixins,
      ruleSetIds: mapped.all,
      topologyPatternId,
      confidence: mapped.confidence,
      mappingScores: mapped.scores,
      unmappedTags: mapped.unmapped,
      exhaustive,
      diagramFlagged,
      handCraftedId,
    };

    if (outputId !== baseSlug) {
      if (!namespacedAwayIds.has(baseSlug)) namespacedAwayIds.set(baseSlug, []);
      namespacedAwayIds.get(baseSlug).push(outputId);
    }

    if (!handCraftedId && (exhaustive || diagramFlagged)) {
      gaps.push({
        id: outputId,
        title,
        section,
        exhaustive,
        diagramFlagged,
        hasGeneratedStub: storedFiles.has(outputId),
        primaryRuleSetId: mapped.primary,
        confidence: mapped.confidence,
      });
    }

    if (ambiguous) {
      // Identity is undecided, so the archive still claims this id — never treat
      // an existing file for it as an orphan.
      claimedOutputIds.add(outputId);
      ambiguousMatches.push({
        archivePath,
        title,
        medium,
        outputId,
        candidates: handMatch.candidates,
      });
      continue;
    }

    if (handCraftedId) {
      skippedHand += 1;
      handSupersededIds.set(outputId, handCraftedId);
      continue;
    }

    claimedOutputIds.add(outputId);

    if (blocked) {
      // Reported via outputCollisions; writing either entry would clobber the other.
      skippedOutputCollision += 1;
      continue;
    }

    confidenceCounts[mapped.confidence] = (confidenceCounts[mapped.confidence] ?? 0) + 1;

    const outPath = path.join(outDir, meta.id + ".json");
    const already = existingGenerated.has(meta.id);
    const stored = storedFiles.get(meta.id);
    if (already && !forceGenerated) {
      skippedExistingGenerated += 1;
      index.push(stored ? { ...stored, writtenThisRun: false } : { ...meta, writtenThisRun: false });
      const g = gaps.find((x) => x.id === meta.id);
      if (g) g.hasGeneratedStub = true;
      continue;
    }

    const stub = buildStub(meta, blurbFromBody(body));

    // Self-validation: an invalid stub is a file error, not a file on disk.
    if (validator) {
      const result = validator.validateStoryEncoding(stub);
      if (result.success === false) {
        skippedInvalidStub += 1;
        console.error(
          `ERROR ${archivePath} → ${meta.id}.json rejected by validateStoryEncoding (not written):`,
        );
        for (const err of result.errors) console.error(`  ${err}`);
        fileErrors.push({
          file: archivePath,
          kind: "schema-invalid-stub",
          outputId: meta.id,
          error: `stub failed validateStoryEncoding: ${result.errors.join("; ")}`,
        });
        continue;
      }
    }

    await writeFile(outPath, JSON.stringify(stub, null, 2) + "\n", "utf8");
    written += 1;
    existingGenerated.add(meta.id);
    storedFiles.set(meta.id, { ...storedStubMetadata(stub, meta.id + ".json"), writtenThisRun: true });
    index.push({ ...meta, writtenThisRun: true });
    const g = gaps.find((x) => x.id === meta.id);
    if (g) g.hasGeneratedStub = true;
  }

  // Phase 4 — inventory instances/generated/ against what the archive now claims.
  const retainedFiles = [];
  const supersededFiles = [];
  const orphanedFiles = [];
  for (const [id, stored] of [...storedFiles.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const record = { file: stored.file, id, title: stored.title, archivePath: stored.archivePath };
    if (claimedOutputIds.has(id)) {
      retainedFiles.push({ ...record, writtenThisRun: stored.writtenThisRun === true });
    } else if (handSupersededIds.has(id)) {
      supersededFiles.push({
        ...record,
        reason: "hand_crafted_instance",
        supersededBy: `instances/${handSupersededIds.get(id)}.json`,
      });
    } else if (namespacedAwayIds.has(id)) {
      supersededFiles.push({
        ...record,
        reason: "section_namespaced",
        supersededBy: [...namespacedAwayIds.get(id)].sort(),
      });
    } else {
      orphanedFiles.push({ ...record, reason: "no archive entry maps to this output id" });
    }
  }

  // Sort gaps: exhaustive first, then diagram, then title
  gaps.sort((a, b) => {
    if (a.exhaustive !== b.exhaustive) return a.exhaustive ? -1 : 1;
    if (a.diagramFlagged !== b.diagramFlagged) return a.diagramFlagged ? -1 : 1;
    return a.title.localeCompare(b.title);
  });

  const unmappedTags = [...unmappedCounter.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));

  const generatedAt = new Date().toISOString();
  const counts = {
    scanned,
    written,
    skippedExistingGenerated,
    skippedHandCrafted: skippedHand,
    skippedOutputCollision,
    skippedInvalidStub,
    totalIndexed: index.length,
    exhaustiveGaps: gaps.filter((g) => g.exhaustive).length,
    diagramGaps: gaps.filter((g) => g.diagramFlagged).length,
    unmappedTagTypes: unmappedTags.length,
    retainedFiles: retainedFiles.length,
    orphanedFiles: orphanedFiles.length,
    supersededFiles: supersededFiles.length,
    ambiguousMatches: ambiguousMatches.length,
    ambiguousHandMatches: ambiguousMatches.length,
    namespaceCollisions: namespaceCollisions.length,
    outputCollisions: outputCollisions.length,
    fileErrors: fileErrors.length,
  };

  const indexPayload = {
    generatedAt,
    archiveRoot,
    forceGenerated,
    policy: {
      neverClobberHandCrafted: true,
      writeDir: "instances/generated/",
      forceGeneratedFlag: "--force-generated",
    },
    counts,
    confidenceCounts,
    stubs: index.map((s) => ({
      id: s.id,
      title: s.title,
      year: s.year,
      medium: s.medium,
      primaryRuleSetId: s.primaryRuleSetId,
      mixinRuleSetIds: s.mixinRuleSetIds,
      topologyPatternId: s.topologyPatternId,
      archivePath: s.archivePath,
      confidence: s.confidence,
      unmappedTags: s.unmappedTags,
      writtenThisRun: s.writtenThisRun,
    })),
    retainedFiles,
    orphanedFiles,
    supersededFiles,
    ambiguousMatches,
    namespaceCollisions,
    outputCollisions,
    fileErrors,
  };

  await writeFile(path.join(outDir, "_index.json"), JSON.stringify(indexPayload, null, 2) + "\n", "utf8");

  const report = {
    generatedAt,
    archiveRoot,
    counts,
    confidenceCounts,
    gaps,
    unmappedTags,
    stubs: indexPayload.stubs,
    retainedFiles,
    orphanedFiles,
    supersededFiles,
    ambiguousMatches,
    namespaceCollisions,
    outputCollisions,
    fileErrors,
  };

  const reportsDir = path.join(root, "instances", "generated");
  const mdPath = path.join(reportsDir, "IMPORT_REPORT.md");
  const jsonPath = path.join(reportsDir, "IMPORT_REPORT.json");
  if (reportFormat === "markdown" || reportFormat === "md" || reportFormat === "both") {
    await writeFile(mdPath, renderMarkdownReport(report), "utf8");
  }
  if (reportFormat === "json" || reportFormat === "both") {
    await writeFile(jsonPath, JSON.stringify(report, null, 2) + "\n", "utf8");
  }

  console.log(
    `Import complete: scanned ${scanned}; wrote ${written}; skipped ${skippedExistingGenerated} existing generated (use --force-generated to refresh); skipped ${skippedHand} hand-crafted.`,
  );
  console.log(`Quality report: ${reportFormat === "json" ? jsonPath : mdPath}`);
  console.log(`Gaps: ${counts.exhaustiveGaps} exhaustive, ${counts.diagramGaps} diagram-flagged without hand-crafted instance; ${counts.unmappedTagTypes} unmapped tag types.`);
  console.log(
    `Ids: ${namespaceCollisions.length} slug(s) namespaced across sections; ${outputCollisions.length} output collision(s) blocked (${skippedOutputCollision} entr(y/ies) skipped).`,
  );
  console.log(
    `Files: ${retainedFiles.length} retained, ${supersededFiles.length} superseded, ${orphanedFiles.length} orphaned (nothing deleted).`,
  );
  console.log(
    `Identity: ${ambiguousMatches.length} AMBIGUOUS hand match(es); ${fileErrors.length} file error(s) including ${skippedInvalidStub} schema-invalid stub(s) not written.`,
  );
  if (fileErrors.length || outputCollisions.length || ambiguousMatches.length) {
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
