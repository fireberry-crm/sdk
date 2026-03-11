import type { ContextDetails, PermissionsData, RecordDetails, UserDetails } from '../types';

type ContextUser = Omit<UserDetails, 'permissions'> & {
  permissions: PermissionsData;
};

export class Context {
  public user: ContextUser;
  public record: RecordDetails;

  constructor(context: ContextDetails) {
    const { permissions, ...userFields } = context.user;
    const safePermissions = permissions ?? { objects: {}, features: {} };
    this.user = {
      ...userFields,
      permissions: Object.freeze({
        objects: Object.freeze(safePermissions.objects),
        features: Object.freeze(safePermissions.features),
      }) as PermissionsData,
    };
    this.record = context.record;
  }
}
