import type { UWSNodeCategory } from "../schema/uws";

/**
 * Maps n8n native node type strings to universal dot-notation types.
 * This is the open, community-editable mapping registry. Anyone can PR
 * a missing mapping. The richer / fuzzier mapping for ambiguous nodes
 * lives in the (paid) AI Translator layer.
 */
export interface NodeMapEntry {
  uwsType: string;
  category: UWSNodeCategory;
}

export const N8N_NODE_TYPE_MAP: Record<string, NodeMapEntry> = {
  // ---- triggers ----
  "n8n-nodes-base.emailReadImap": {
    uwsType: "trigger.email.received",
    category: "trigger",
  },
  "n8n-nodes-base.webhook": {
    uwsType: "trigger.webhook.received",
    category: "trigger",
  },
  "n8n-nodes-base.scheduleTrigger": {
    uwsType: "trigger.schedule.interval",
    category: "trigger",
  },
  "n8n-nodes-base.manualTrigger": {
    uwsType: "trigger.manual.run",
    category: "trigger",
  },

  // ---- logic ----
  "n8n-nodes-base.if": {
    uwsType: "logic.condition.branch",
    category: "logic",
  },
  "n8n-nodes-base.switch": {
    uwsType: "logic.condition.switch",
    category: "logic",
  },
  "n8n-nodes-base.merge": {
    uwsType: "logic.flow.merge",
    category: "logic",
  },

  // ---- transform ----
  "n8n-nodes-base.set": {
    uwsType: "transform.data.set",
    category: "transform",
  },
  "n8n-nodes-base.code": {
    uwsType: "transform.code.run",
    category: "transform",
  },

  // ---- actions ----
  "n8n-nodes-base.httpRequest": {
    uwsType: "action.http.request",
    category: "action",
  },
  "n8n-nodes-base.emailSend": {
    uwsType: "action.email.send",
    category: "action",
  },
  "n8n-nodes-base.slack": {
    uwsType: "action.slack.message",
    category: "action",
  },
};
