import { MESSAGE_TYPES, REQUEST_ACTIONS } from '../constants';
import { Context } from '../context';

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
}>;

export type UserDetails = Partial<{
  fullName: string;
  id: string;
}>;

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
  type?: MessageType;
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

export interface API<TData extends Response> {
  query: (objectType: string | number, payload: QueryPayload) => Promise<ResponseData<TData>>;
  create: <T extends Payload>(
    objectType: string | number,
    payload: T
  ) => Promise<ResponseData<TData>>;
  delete: (objectType: string | number, recordId: string) => Promise<ResponseData<TData>>;
  update: <T extends Payload>(
    objectType: string | number,
    recordId: string,
    payload: T
  ) => Promise<ResponseData<TData>>;
}
