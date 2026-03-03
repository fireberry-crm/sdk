/**
 * Map of known Fireberry object names to their numeric type identifiers.
 *
 * You can extend this interface with custom objects via declaration merging:
 *
 * @example
 * ```ts
 * // custom-objects.d.ts
 * import "@fireberry/sdk/client";
 *
 * declare module "@fireberry/sdk/client" {
 *   interface Objects {
 *     myCustomObject: 1001;
 *     anotherCustomObject: 1002;
 *   }
 * }
 *
 * // constants.ts
 * export const objects={
 *   ...OBJECTS,
 *     myCustomObject: 1001,
 *     anotherCustomObject: 1002
 * } as const satisfies Objects;
 *
 * // main.ts
 * import { objects } from './constants';
 * import FireberryClientSDK from "@fireberry/sdk/client";
 *
 * const client = new FireberryClientSDK();
 * const fields = await client.metadata.getFields(objects.myCustomObject);
 * client.metadata.getFields(objects.myCustomObject, 'pcfsystemfield4');
 * ```
 */
export interface Objects {
  account: 1;
  contact: 2;
  opportunity: 4;
  cases: 5;
  activity: 6;
  competitor: 8;
  user: 9;
  task: 10;
  order: 13;
  product: 14;
  orderItem: 17;
  businessUnits: 23;
  contract: 28;
  accountProduct: 33;
  project: 46;
  campaign: 67;
  articles: 76;
  callLog: 100;
  attendanceClock: 101;
  activityLog: 102;
  conversation: 104;
  textTemplate: 106;
  smsTemplate: 110;
  resources: 114;
  profile: 116;
}
