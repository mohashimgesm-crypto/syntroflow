/**
 * Universal Workflow Schema (UWS)
 * --------------------------------
 * The platform-agnostic intermediate representation that every workflow
 * is translated INTO and FROM. This is the contract that decouples
 * source platforms (n8n, Make, Zapier, ...) from target platforms.
 *
 * Parser:     Platform JSON  ->  UWS
 * Serializer: UWS            ->  Platform JSON
 *
 * Node types use dot notation: "<category>.<service>.<action>"
 *   trigger.email.received
 *   logic.condition.branch
 *   action.http.request
 */

export type UWSNodeCategory =
  | "trigger"
  | "action"
  | "logic"
  | "transform"
  | "unknown";

/** A single connection between two nodes (edge in the graph). */
export interface UWSConnection {
  /** id of the source node */
  from: string;
  /** id of the target node */
  to: string;
  /** optional output port label (e.g. "true" / "false" for a branch) */
  sourcePort?: string;
}

/** Position on the visual canvas (preserved for round-tripping). */
export interface UWSPosition {
  x: number;
  y: number;
}

/** A single step in the workflow. */
export interface UWSNode {
  /** stable id, unique within the workflow */
  id: string;
  /** human label shown on the canvas */
  name: string;
  /** dot-notation universal type, e.g. "trigger.email.received" */
  type: string;
  category: UWSNodeCategory;
  /** normalised parameters, key/value */
  parameters: Record<string, unknown>;
  position?: UWSPosition;
  /**
   * Fields the parser could not confidently map. Carried through so the
   * Compatibility Report (paid layer) can surface them for manual review.
   */
  unmapped?: Record<string, unknown>;
}

/** The complete workflow in universal form. */
export interface UniversalWorkflow {
  /** schema version, for forward-compat migrations */
  uwsVersion: "1.0";
  /** which platform this was parsed from */
  source: SupportedPlatform;
  name: string;
  nodes: UWSNode[];
  connections: UWSConnection[];
  /** anything platform-specific we want to keep but not standardise */
  meta?: Record<string, unknown>;
}

export type SupportedPlatform =
  | "n8n"
  | "make"
  | "zapier"
  | "activepieces"
  | "pipedream"
  | "pabbly";
