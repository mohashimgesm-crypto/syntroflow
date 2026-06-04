import type { UniversalWorkflow, SupportedPlatform } from "../schema/uws";

/**
 * Every source platform implements a parser: its native export JSON -> UWS.
 */
export interface PlatformParser<TNative extends object = object> {
  readonly platform: SupportedPlatform;
  /** quick check so the engine can auto-detect the input format */
  canParse(input: unknown): input is TNative;
  parse(input: TNative): UniversalWorkflow;
}

/**
 * Every target platform implements a serializer: UWS -> its native JSON.
 */
export interface PlatformSerializer<TNative = unknown> {
  readonly platform: SupportedPlatform;
  serialize(workflow: UniversalWorkflow): TNative;
}
