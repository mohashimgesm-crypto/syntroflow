import type {
  UniversalWorkflow,
  UWSNode,
  UWSConnection,
} from "../schema/uws";
import type { PlatformParser } from "./types";
import { N8N_NODE_TYPE_MAP } from "../node-map/n8n";

// --- minimal shape of an n8n export (only what we read) ---
interface N8nNode {
  name: string;
  type: string;
  parameters?: Record<string, unknown>;
  position?: [number, number];
}

interface N8nWorkflow {
  name?: string;
  nodes: N8nNode[];
  // n8n keys connections by SOURCE NODE NAME (not id)
  connections: Record<
    string,
    { main: Array<Array<{ node: string; type: string; index: number }>> }
  >;
}

export const n8nParser: PlatformParser<N8nWorkflow> = {
  platform: "n8n",

  canParse(input): input is N8nWorkflow {
    if (typeof input !== "object" || input === null) return false;
    const obj = input as Record<string, unknown>;
    return Array.isArray(obj.nodes) && typeof obj.connections === "object";
  },

  parse(input: N8nWorkflow): UniversalWorkflow {
    const nodes: UWSNode[] = input.nodes.map((n, i) => {
      const mapped = N8N_NODE_TYPE_MAP[n.type];
      const node: UWSNode = {
        id: `node_${i}`,
        name: n.name,
        type: mapped?.uwsType ?? "unknown",
        category: mapped?.category ?? "unknown",
        parameters: n.parameters ?? {},
        position: n.position
          ? { x: n.position[0], y: n.position[1] }
          : undefined,
      };
      // record nodes we could not map so the Compatibility Report can flag them
      if (!mapped) {
        node.unmapped = { originalType: n.type };
      }
      return node;
    });

    // n8n references nodes by NAME in connections; build a name -> id index
    const idByName = new Map<string, string>();
    input.nodes.forEach((n, i) => idByName.set(n.name, `node_${i}`));

    const connections: UWSConnection[] = [];
    for (const [sourceName, conn] of Object.entries(input.connections)) {
      const fromId = idByName.get(sourceName);
      if (!fromId) continue;
      conn.main?.forEach((port, portIndex) => {
        port?.forEach((target) => {
          const toId = idByName.get(target.node);
          if (!toId) return;
          connections.push({
            from: fromId,
            to: toId,
            sourcePort: portIndex === 0 ? undefined : String(portIndex),
          });
        });
      });
    }

    return {
      uwsVersion: "1.0",
      source: "n8n",
      name: input.name ?? "Untitled workflow",
      nodes,
      connections,
    };
  },
};
