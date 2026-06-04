import type { UniversalWorkflow } from "../schema/uws";
import type { PlatformSerializer } from "../parsers/types";

/**
 * Reverse of the n8n map: universal dot-notation type -> Make.com module name.
 * Only the open, common set ships here. Ambiguous / proprietary modules are
 * resolved by the AI Translator (paid layer) and surfaced in the report.
 */
const UWS_TO_MAKE_MODULE: Record<string, string> = {
  "trigger.email.received": "email:TriggerNewEmail",
  "trigger.webhook.received": "gateway:CustomWebHook",
  "trigger.schedule.interval": "builtin:BasicFeeder",
  "logic.condition.branch": "builtin:BasicRouter",
  "transform.data.set": "util:SetVariables",
  "action.http.request": "http:ActionSendData",
  "action.email.send": "email:ActionSendEmail",
  "action.slack.message": "slack:CreateMessage",
};

// minimal shape of a Make blueprint (only what we emit)
export interface MakeModule {
  id: number;
  module: string;
  version: number;
  parameters: Record<string, unknown>;
  metadata: { designer: { x: number; y: number } };
}

export interface MakeBlueprint {
  name: string;
  flow: MakeModule[];
  metadata: { instant: boolean; version: number };
}

export const makeSerializer: PlatformSerializer<MakeBlueprint> = {
  platform: "make",

  serialize(workflow: UniversalWorkflow): MakeBlueprint {
    // Make orders modules linearly in `flow`; we lay them out in graph order
    const flow: MakeModule[] = workflow.nodes.map((node, i) => ({
      id: i + 1,
      module: UWS_TO_MAKE_MODULE[node.type] ?? "builtin:Unsupported",
      version: 1,
      parameters: node.parameters,
      metadata: {
        designer: {
          x: node.position?.x ?? i * 300,
          y: node.position?.y ?? 0,
        },
      },
    }));

    return {
      name: workflow.name,
      flow,
      metadata: { instant: false, version: 1 },
    };
  },
};
