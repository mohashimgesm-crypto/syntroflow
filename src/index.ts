import { n8nParser } from "./parsers/n8n";
import { makeSerializer } from "./serializers/make";
import type { UniversalWorkflow } from "./schema/uws";

export * from "./schema/uws";
export { n8nParser } from "./parsers/n8n";
export { makeSerializer } from "./serializers/make";
export { N8N_NODE_TYPE_MAP } from "./node-map/n8n";

/**
 * OPEN CORE: a single supported direction — n8n -> Make.com.
 *
 * The full product unlocks every direction between all six platforms,
 * an AI Translator for ambiguous nodes, and a Compatibility Report that
 * lists exactly what needs manual review. See the README.
 */
export function n8nToMake(n8nExport: unknown) {
  if (!n8nParser.canParse(n8nExport)) {
    throw new Error(
      "Input does not look like an n8n workflow export (expected { nodes, connections })."
    );
  }
  const universal: UniversalWorkflow = n8nParser.parse(n8nExport);
  const blueprint = makeSerializer.serialize(universal);

  // simple coverage signal (the full report is in the paid layer)
  const total = universal.nodes.length;
  const unmapped = universal.nodes.filter((n) => n.type === "unknown").length;
  const coverage = total === 0 ? 1 : (total - unmapped) / total;

  return {
    blueprint,
    universal,
    coverage, // 0..1 ; nodes the open map handled automatically
    needsReview: universal.nodes
      .filter((n) => n.type === "unknown")
      .map((n) => ({ node: n.name, original: n.unmapped?.originalType })),
  };
}
