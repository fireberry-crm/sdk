import {
  APP_SUBSCRIPTION_BILLING_CYCLE_PLAN,
  APP_SUBSCRIPTION_STATUS,
  FIELD_TYPES,
  MESSAGE_TYPES,
  REQUEST_ACTIONS,
} from '../constants';
import { Context } from '../context';
import { Objects } from './objects';

export type Response = Partial<BusinessObject> & Partial<Context>;
export type Data = Partial<BusinessObject> & { requestId?: string };
export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];
export type RequestAction = (typeof REQUEST_ACTIONS)[keyof typeof REQUEST_ACTIONS];

export type MessagePayload = Record<string, unknown> & {
  type: MessageType;
} & Partial<RequestPayload>;
export type Payload = Record<string, unknown>;

export type ResponseError = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data: Record<string, any> & { Message?: string };
  status: number;
  statusText: string;
};

export type RecordDetails = Partial<{
  type: number;
  id: string;
  storage: StorageRecordAPI;
}>;

export type UserDetails = Partial<{
  fullName: string;
  id: string;
  organizationId: string;
  license: LicenseDetails | null;
  permissions: PermissionsData;
}>;

export type AppSubscriptionBillingCyclePlanValues =
  (typeof APP_SUBSCRIPTION_BILLING_CYCLE_PLAN)[keyof typeof APP_SUBSCRIPTION_BILLING_CYCLE_PLAN];

export type AppSubscriptionStatusValues =
  (typeof APP_SUBSCRIPTION_STATUS)[keyof typeof APP_SUBSCRIPTION_STATUS];

export type LicenseDetails = {
  licenseLevel: number;
  invoiceName: string;
  subscription?: {
    seats: number;
    billingCyclePlan: AppSubscriptionBillingCyclePlanValues;
    status: AppSubscriptionStatusValues;
    endDate: Date;
  };
};

export type ContextDetails = {
  record: RecordDetails;
  user: UserDetails;
};

export type RequestPayload = {
  action: RequestAction;
  objectType?: string | number;
  recordId?: string;
};

export type BusinessObject = {
  createdBy: string;
  createdByName: string;
  createdOn: Date;
  ownerId: string;
  ownerName: string;
  modifiedBy: string;
  modifiedByName: string;
  modifiedOn: Date;
};

export type ResponseData<T extends Response> = {
  type?: Exclude<MessageType, typeof MESSAGE_TYPES.EVENT>;
  success: boolean;
  data: T & Data;
  error?: ResponseError;
  isParentReady: boolean;
  requestId: string;
};

export type QueryPayload = {
  fields: string;
  query: string;
  page_size?: number;
  page_number?: number;
};

export type BadgeType = 'success' | 'warning' | 'error' | 'info';

export type BadgePayload = {
  number: number;
  badgeType: BadgeType;
};

export type CallbarPayload = {
  callInfo: {
    number: number;
    status: 'Talking' | 'Ringing' | 'Missed' | 'Dialing';
  };
  objectConfigs: {
    objectType: string;
    order?: number;
    fields: {
      name: string;
    }[];
  }[];
  placement: 'bottom-start' | 'bottom-end';
};

export type FieldType = (typeof FIELD_TYPES)[number];

export type PicklistOption = {
  value: number;
  textValue: string;
  order: number;
};

type FieldMetaBase = {
  name: string;
  label: string;
  readonly: boolean;
};

type LookUpFieldMeta = FieldMetaBase & {
  type: 'lookUp';
  relatedObjectType: number;
};

type PicklistFieldMeta = FieldMetaBase & {
  type: 'picklist';
  options: PicklistOption[];
};

type RegularFieldMeta = FieldMetaBase & {
  type: Exclude<FieldType, 'lookUp' | 'picklist'>;
};

export type FieldMeta = LookUpFieldMeta | PicklistFieldMeta | RegularFieldMeta;

export type ObjectMeta = {
  type: number;
  name: string;
  pluralName: string;
};

export type ObjectPermission = {
  create: boolean;
  read: boolean;
  update: boolean;
  delete: boolean;
};

export type FeaturePermission = {
  allowed: boolean;
};

export type PermissionObjects = {
  readonly [K in Objects[keyof Objects]]: ObjectPermission;
} & {
  readonly [key: number]: ObjectPermission | undefined;
};

export type PermissionFeatures = {
  readonly [feature: string]: FeaturePermission;
};

export type PermissionsData = {
  objects: PermissionObjects;
  features: PermissionFeatures;
};

export interface MetadataAPI {
  getFields: (objectType: ObjectType) => Promise<string[]>;
  getField: (objectType: ObjectType, fieldName: string) => Promise<FieldMeta>;
  getObjects: () => Promise<ObjectMeta[]>;
}

export type JsonPrimitive = string | number | boolean | null;
export type JsonObject = { [key: string]: JsonValue };
export type JsonArray = JsonValue[];
export type JsonValue = JsonPrimitive | JsonObject | JsonArray;

export interface SettingsAPI<TSettings = JsonValue> {
  get: () => Promise<TSettings>;
  set: (settings: TSettings) => Promise<TSettings>;
}

export interface API<TData extends Response> {
  query: (objectType: ObjectType, payload: QueryPayload) => Promise<ResponseData<TData>>;
  create: <T extends Payload>(objectType: ObjectType, payload: T) => Promise<ResponseData<TData>>;
  delete: (objectType: ObjectType, recordId: string) => Promise<ResponseData<TData>>;
  update: <T extends Payload>(
    objectType: ObjectType,
    recordId: string,
    payload: T
  ) => Promise<ResponseData<TData>>;
  metadata: MetadataAPI;
}

export type FileMetadata = {
  url: string;
  id: string;
  name: string;
  size: number;
};

export type GetFilesResponse = {
  data: FileMetadata[];
  pageNumber: number;
  pageSize: number;
  isLastPage: boolean;
};

export type PaginationPayload = {
  pageNumber?: number;
  pageSize?: number;
};

export interface StorageAPI {
  getFile: (fileId: string) => Promise<File>;
  uploadFile: (file: File) => Promise<{ url: string; id: string }>;
  deleteFile: (fileId: string) => Promise<void>;
  getFiles: (payload: PaginationPayload) => Promise<GetFilesResponse>;
}

export interface StorageRecordAPI {
  uploadFile: (file: File) => Promise<{ url: string; id: string }>;
  getFiles: (payload: PaginationPayload) => Promise<GetFilesResponse>;
}
export type ToastPayload = {
  content: string;
  withCloseButton?: boolean;
  autoDismissTimeout?: number;
  toastType: 'success' | 'warning' | 'error' | 'info';
  placement:
    | 'top-right'
    | 'top-left'
    | 'top-center'
    | 'top-start'
    | 'top-end'
    | 'bottom-right'
    | 'bottom-left'
    | 'bottom-center'
    | 'bottom-start'
    | 'bottom-end';
};

export type ObjectType = Objects[keyof Objects] | string | (number & {});
export type { Objects } from './objects';
