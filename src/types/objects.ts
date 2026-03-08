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

import { OBJECTS } from '../constants';

type BaseObjects = typeof OBJECTS;

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Objects extends BaseObjects {}
