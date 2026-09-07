import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { zodToJsonSchema } from "zod-to-json-schema";
import { StoryEncodingSchema } from "./schema/story.js";
import { RuleSetSchema } from "./schema/rules.js";
import { TopologyPatternSchema } from "./schema/topology.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
// Optional CLI arg: write the export to a given path. Default is the committed schema.
const outPath = process.argv[2]
  ? path.resolve(process.argv[2])
  : path.resolve(__dirname, "..", "schema", "ontology.schema.json");

async function main(): Promise<void> {
  const schema = zodToJsonSchema(StoryEncodingSchema, {
    name: "StoryEncoding",
    definitions: {
      RuleSet: RuleSetSchema,
      TopologyPattern: TopologyPatternSchema,
    },
    $refStrategy: "none",
  });

  const doc = {
    $schema: "http://json-schema.org/draft-07/schema#",
    $id: "https://stephenf.local/time-travel-ontology/ontology.schema.json",
    title: "Time Travel / Multiverse Story Encoding Ontology",
    description:
      "Machine-checkable encoding of rule sets, world topology, and narrative graphs for time-travel and multiverse stories.",
    ...schema,
  };

  await mkdir(path.dirname(outPath), { recursive: true });
  await writeFile(outPath, JSON.stringify(doc, null, 2) + "\n", "utf8");
  console.log(`Wrote ${outPath}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
