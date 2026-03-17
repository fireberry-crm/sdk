export const MESSAGE_TYPES = {
  RESPONSE: 'RESPONSE',
  REQUEST: 'REQUEST',
  REQUEST_CONTEXT: 'REQUEST_CONTEXT',
  LOG: 'LOG',
  EVENT: 'EVENT',
} as const;

export const REQUEST_ACTIONS = {
  SHOW_CALLBAR: 'SHOW_CALLBAR',
  HIDE_CALLBAR: 'HIDE_CALLBAR',
  CREATE: 'CREATE',
  DELETE: 'DELETE',
  UPDATE: 'UPDATE',
  QUERY: 'QUERY',
  SHOW_BADGE: 'SHOW_BADGE',
  HIDE_BADGE: 'HIDE_BADGE',
  GET_SETTINGS: 'GET_SETTINGS',
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  UPLOAD_FILE: 'UPLOAD_FILE',
  UPLOAD_RECORD_FILE: 'UPLOAD_RECORD_FILE',
  DELETE_FILE: 'DELETE_FILE',
  GET_FILES: 'GET_FILES',
  GET_RECORD_FILES: 'GET_RECORD_FILES',
  GET_FILE: 'GET_FILE',
  SHOW_TOAST: 'SHOW_TOAST',
  HIDE_TOAST: 'HIDE_TOAST',
  GET_METADATA_FIELDS: 'GET_METADATA_FIELDS',
  GET_METADATA_FIELD: 'GET_METADATA_FIELD',
  GET_METADATA_OBJECTS: 'GET_METADATA_OBJECTS',
} as const;

export const FIELD_TYPES = [
  'date',
  'dateTime',
  'emailAddress',
  'lookUp',
  'number',
  'picklist',
  'richText',
  'text',
  'textArea',
  'url',
  'telephone',
  'formula',
  'summary',
] as const;

export const TIMEOUT_DURATION = 60000; // one minute;

export const APP_SUBSCRIPTION_BILLING_CYCLE_PLAN = {
  annual: 1,
  monthly: 2,
} as const;

export const APP_SUBSCRIPTION_STATUS = {
  active: 1,
  inactive: 2,
  chargeError: 3,
  blockedPayment: 4,
  trial: 5,
  trialExpired: 6,
} as const;

export const OBJECTS = {
  account: 1,
  contact: 2,
  opportunity: 4,
  cases: 5,
  activity: 6,
  competitor: 8,
  user: 9,
  task: 10,
  order: 13,
  product: 14,
  orderItem: 17,
  businessUnits: 23,
  contract: 28,
  accountProduct: 33,
  project: 46,
  campaign: 67,
  articles: 76,
  callLog: 100,
  attendanceClock: 101,
  activityLog: 102,
  conversation: 104,
  textTemplate: 106,
  smsTemplate: 110,
  resources: 114,
  profile: 116,
} as const;
