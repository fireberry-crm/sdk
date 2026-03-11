import { OBJECTS } from '../constants';

type BaseObjects = typeof OBJECTS;

/**
 * Map of known Fireberry object names to their numeric type identifiers.
 *
 * You can extend this interface with custom objects via declaration merging @see https://developers.fireberry.com/docs/sdk#extending-sdk-types-with-declaration-merging
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Objects extends BaseObjects {}
